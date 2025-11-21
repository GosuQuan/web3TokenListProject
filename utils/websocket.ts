import pako from 'pako';
import { TokenData, WebSocketMessage } from '@/types/token';

/**
 * 解压缩数据的工具函数
 * @param compressedString 压缩的字符串
 * @returns 解压后的JSON字符串
 */
export function decompressData(compressedString: string): string {
  try {
    // 1. 将 ISO-8859-1 字符串解码为字节数组
    const byteArray = new Uint8Array(compressedString.length);
    for (let i = 0; i < compressedString.length; i++) {
      byteArray[i] = compressedString.charCodeAt(i) & 0xff; // 取低8位
    }

    // 2. GZIP 解压字节数据
    const decompressedData = pako.inflate(byteArray);

    // 3. 将解压后的字节数组转为 UTF-8 字符串
    return new TextDecoder('utf-8').decode(decompressedData);
  } catch (error) {
    console.error('Failed to decompress data:', error);
    throw new Error('Data decompression failed');
  }
}

/**
 * WebSocket管理类
 */
export class TrendingTokenWebSocket {
  private ws: WebSocket | null = null;
  private url: string = 'wss://web-t.pinkpunk.io/ws';
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private heartbeatTimeout: ReturnType<typeof setTimeout> | null = null;

  private onMessageCallback: ((data: TokenData[]) => void) | null = null;
  private onErrorCallback: ((error: Error) => void) | null = null;
  private onConnectCallback: (() => void) | null = null;
  private onDisconnectCallback: (() => void) | null = null;

  /**
   * 连接到WebSocket
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.subscribe();
          this.startHeartbeat();
          this.onConnectCallback?.();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          const err = new Error('WebSocket connection error');
          this.onErrorCallback?.(err);
          reject(err);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.stopHeartbeat();
          this.onDisconnectCallback?.();
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 订阅trending数据
   */
  private subscribe(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not open, cannot subscribe');
      return;
    }

    const subscribeMessage = {
      topic: 'trending',
      event: 'sub',
      interval: '',
      pair: '',
      chainId: '56',
      compression: 0,
    };

    this.ws.send(JSON.stringify(subscribeMessage));
    console.log('Subscription message sent');
  }

  /**
   * 处理WebSocket消息
   */
  private handleMessage(data: string): void {
    try {
      // 尝试解析JSON
      let message: WebSocketMessage;
      
      try {
        message = JSON.parse(data);
      } catch {
        // 如果JSON解析失败，尝试解压缩
        const decompressed = decompressData(data);
        message = JSON.parse(decompressed);
      }

      // 处理ping消息，回复pong
      if (message.topic === 'ping' || message.pong !== undefined) {
        this.handlePing(message);
        return;
      }

      // 处理数据消息
      if (message.data && Array.isArray(message.data)) {
        this.onMessageCallback?.(message.data);
      }
    } catch (error) {
      console.error('Failed to handle message:', error);
      this.onErrorCallback?.(new Error('Message handling failed'));
    }
  }

  /**
   * 处理ping消息，发送pong响应
   */
  private handlePing(message: WebSocketMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const pongMessage = {
      topic: 'pong',
      event: 'sub',
      pong: message.pong || String(Date.now()),
      interval: '',
      pair: '',
      chainId: '',
      compression: 1,
    };

    this.ws.send(JSON.stringify(pongMessage));
    console.log('Pong message sent');
  }

  /**
   * 启动心跳机制
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        // 发送ping消息
        const pingMessage = {
          topic: 'ping',
          event: 'sub',
          interval: '',
          pair: '',
          chainId: '56',
          compression: 0,
        };
        this.ws.send(JSON.stringify(pingMessage));

        // 设置超时，如果在规定时间内没有收到响应，认为连接已断开
        this.heartbeatTimeout = setTimeout(() => {
          console.warn('Heartbeat timeout, reconnecting...');
          this.disconnect();
          this.attemptReconnect();
        }, 10000);
      }
    }, 30000); // 每30秒发送一次ping
  }

  /**
   * 停止心跳机制
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  /**
   * 尝试重新连接
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * this.reconnectAttempts;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
      
      setTimeout(() => {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.onErrorCallback?.(new Error('Failed to reconnect after maximum attempts'));
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * 注册消息回调
   */
  onMessage(callback: (data: TokenData[]) => void): void {
    this.onMessageCallback = callback;
  }

  /**
   * 注册错误回调
   */
  onError(callback: (error: Error) => void): void {
    this.onErrorCallback = callback;
  }

  /**
   * 注册连接成功回调
   */
  onConnect(callback: () => void): void {
    this.onConnectCallback = callback;
  }

  /**
   * 注册断开连接回调
   */
  onDisconnect(callback: () => void): void {
    this.onDisconnectCallback = callback;
  }

  /**
   * 检查连接状态
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

/**
 * 创建全局WebSocket实例
 */
export const trendingTokenWS = new TrendingTokenWebSocket();
