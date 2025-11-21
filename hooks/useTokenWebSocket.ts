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

    return {
      rank: index + 1,
      name: item.baseName,
      symbol: item.baseSymbol,
      chain: item.dex,
      price: item.priceUsd,
      priceChange1h: item.priceChange1h * 100, // 转换为百分比
      priceChange24h: item.priceChange24h * 100,
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
    // 注册回调函数
    trendingTokenWS.onMessage((data: TokenData[]) => {
      const transformedTokens = transformTokenData(data);
      setTokens(transformedTokens);
      console.log(`Updated ${transformedTokens.length} tokens`);
    });

    trendingTokenWS.onConnect(() => {
      setIsConnected(true);
      setError(null);
      console.log('Connected to trending tokens WebSocket');
    });

    trendingTokenWS.onDisconnect(() => {
      setIsConnected(false);
      console.log('Disconnected from trending tokens WebSocket');
    });

    trendingTokenWS.onError((err: Error) => {
      setError(err.message);
      setIsConnected(false);
      console.error('WebSocket error:', err);
    });

    // 连接 WebSocket
    trendingTokenWS.connect().catch((err) => {
      console.error('Failed to connect:', err);
      setError(err.message);
    });

    // 清理函数
    return () => {
      trendingTokenWS.disconnect();
    };
  }, []);

  const reconnect = () => {
    trendingTokenWS.disconnect();
    trendingTokenWS.connect().catch((err) => {
      console.error('Failed to reconnect:', err);
      setError(err.message);
    });
  };

  return { tokens, isConnected, error, reconnect };
}
