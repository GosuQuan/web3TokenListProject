import { useEffect, useState } from 'react';
import { Token, TokenData } from '@/types/token';
import { trendingTokenWS } from '@/utils/websocket';

interface UseTokenWebSocketReturn {
  tokens: Token[];
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
}

/**
 * 转换 API 数据为前端展示格式
 */
function transformTokenData(apiData: TokenData[]): Token[] {
  return apiData.map((item, index) => {
    // 计算时间差（简化版本）
    const calculateAge = (): string => {
      // 这里可以根据实际需求计算，暂时返回固定值
      return '< 1d';
    };

    // API 返回的涨跌幅可能是小数（如 0.01 = 1%）或已经是百分比（如 1 = 1%）
    // 根据数值范围判断：如果绝对值小于 1，则认为是小数格式，需要乘以 100
    const normalizePercentage = (value: number): number => {
      if (Math.abs(value) < 1 && value !== 0) {
        return value * 100;
      }
      return value;
    };

    const token = {
      rank: index + 1,
      name: item.baseName,
      symbol: item.baseSymbol,
      chain: item.dex,
      price: item.priceUsd,
      priceChange1h: normalizePercentage(item.priceChange1h),
      priceChange24h: normalizePercentage(item.priceChange24h),
      volume24h: item.volumeUsd24h,
      volumeChange24h: 0, // API 没有提供，设为 0
      marketCap: item.marketCap,
      marketCapChange24h: 0, // API 没有提供，设为 0
      holders: 0, // API 没有提供
      holdersChange24h: 0,
      txns24h: item.count24h,
      txnsChange24h: 0,
      age: calculateAge(),
      lastUpdate: Date.now(),
      dex: item.dex,
      liquidity: item.liquidity,
      pair: item.pair,
    };

    // 调试：打印第一个 token 的数据
    if (index === 0) {
      console.log('Sample token data:', {
        symbol: item.baseSymbol,
        priceChange1h_raw: item.priceChange1h,
        priceChange1h_normalized: token.priceChange1h,
        priceChange24h_raw: item.priceChange24h,
        priceChange24h_normalized: token.priceChange24h,
      });
    }

    return token;
  });
}

/**
 * 使用 WebSocket 获取 trending tokens 数据的 Hook
 */
export function useTokenWebSocket(): UseTokenWebSocketReturn {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // 注册回调函数
      trendingTokenWS.onMessage((data: TokenData[]) => {
        try {
          const transformedTokens = transformTokenData(data);
          setTokens(transformedTokens);
          console.log(`Updated ${transformedTokens.length} tokens`);
        } catch (error) {
          console.error('Error transforming token data:', error);
          setError('Failed to process token data');
        }
      });

      trendingTokenWS.onConnect(() => {
        try {
          setIsConnected(true);
          setError(null);
          console.log('Connected to trending tokens WebSocket');
        } catch (error) {
          console.error('Error in connect callback:', error);
        }
      });

      trendingTokenWS.onDisconnect(() => {
        try {
          setIsConnected(false);
          console.log('Disconnected from trending tokens WebSocket');
        } catch (error) {
          console.error('Error in disconnect callback:', error);
        }
      });

      trendingTokenWS.onError((err: Error) => {
        try {
          setError(err.message);
          setIsConnected(false);
          console.error('WebSocket error:', err);
        } catch (error) {
          console.error('Error in error callback:', error);
        }
      });

      // 连接 WebSocket
      trendingTokenWS.connect().catch((err) => {
        console.error('Failed to connect:', err);
        setError(err.message || 'Failed to connect to WebSocket');
      });

      // 清理函数
      return () => {
        try {
          trendingTokenWS.disconnect();
        } catch (error) {
          console.error('Error disconnecting WebSocket:', error);
        }
      };
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setError('Failed to initialize WebSocket connection');
    }
  }, []);

  const reconnect = () => {
    try {
      trendingTokenWS.disconnect();
      trendingTokenWS.connect().catch((err) => {
        console.error('Failed to reconnect:', err);
        setError(err.message || 'Failed to reconnect');
      });
    } catch (error) {
      console.error('Error in reconnect:', error);
      setError('Failed to reconnect to WebSocket');
    }
  };

  return { tokens, isConnected, error, reconnect };
}
