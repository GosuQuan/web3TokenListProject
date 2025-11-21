import { useEffect, useState, useRef, useCallback } from 'react';
import { Token } from '@/types/token';

interface UseTokenWebSocketReturn {
  tokens: Token[];
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
}

export function useTokenWebSocket(wsUrl: string): UseTokenWebSocketReturn {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const connect = useCallback(() => {
    try {
      // For demo purposes, we'll use mock data since WebSocket URL is not provided
      // Replace this with actual WebSocket connection when URL is available
      setIsConnected(true);
      setError(null);
      
      // Simulate initial data
      const mockTokens = generateMockTokens();
      setTokens(mockTokens);

      // Simulate updates every 1-3 seconds
      const updateInterval = setInterval(() => {
        setTokens((prevTokens: Token[]) => updateMockTokens(prevTokens));
      }, Math.random() * 2000 + 1000);

      return () => {
        clearInterval(updateInterval);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setIsConnected(false);
    }
  }, []);

  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    connect();
  }, [connect]);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      if (cleanup) cleanup();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  return { tokens, isConnected, error, reconnect };
}

// Mock data generators
function generateMockTokens(): Token[] {
  const tokens: Token[] = [
    {
      rank: 1,
      name: 'ACM',
      symbol: 'ACM',
      chain: '7h',
      price: 0.122916,
      priceChange1h: 1.08,
      priceChange24h: -0.87,
      volume24h: 979.95,
      volumeChange24h: -0.07,
      marketCap: 24907.02,
      marketCapChange24h: -0.87,
      holders: 0,
      holdersChange24h: 0,
      txns24h: 0,
      txnsChange24h: 0,
      age: '1d 0h 22m'
    },
    {
      rank: 2,
      name: 'PNUT',
      symbol: 'PNUT',
      chain: '7h',
      price: 1.53,
      priceChange1h: 0.87,
      priceChange24h: -13.51,
      volume24h: 553.19,
      volumeChange24h: -13.51,
      marketCap: 1530.02,
      marketCapChange24h: -13.51,
      holders: 0,
      holdersChange24h: 0,
      txns24h: 0,
      txnsChange24h: 0,
      age: '1d 0h 22m'
    },
    {
      rank: 3,
      name: 'ELIZA',
      symbol: 'ELIZA',
      chain: '8h',
      price: 0.01429,
      priceChange1h: 59.88,
      priceChange24h: -13.11,
      volume24h: 302.6,
      volumeChange24h: 3.95,
      marketCap: 14.29,
      marketCapChange24h: -13.11,
      holders: 0,
      holdersChange24h: 0,
      txns24h: 0,
      txnsChange24h: 0,
      age: '1d 0h 22m'
    },
    {
      rank: 4,
      name: 'AI',
      symbol: 'AI',
      chain: '11d',
      price: 0.1047,
      priceChange1h: 4.48,
      priceChange24h: 0.03,
      volume24h: 227.78,
      volumeChange24h: -0.04,
      marketCap: 104.7,
      marketCapChange24h: 0.03,
      holders: 0,
      holdersChange24h: 0,
      txns24h: 0,
      txnsChange24h: 0,
      age: '1d 0h 22m'
    },
    {
      rank: 5,
      name: 'WORM',
      symbol: 'WORM',
      chain: '02d',
      price: 0.00207,
      priceChange1h: -0.02,
      priceChange24h: -0.02,
      volume24h: 91.21,
      volumeChange24h: -0.02,
      marketCap: 2.07,
      marketCapChange24h: -0.02,
      holders: 0,
      holdersChange24h: 0,
      txns24h: 0,
      txnsChange24h: 0,
      age: '1d 0h 22m'
    }
  ];

  return tokens;
}

function updateMockTokens(tokens: Token[]): Token[] {
  return tokens.map(token => ({
    ...token,
    price: token.price * (1 + (Math.random() - 0.5) * 0.02),
    priceChange1h: token.priceChange1h + (Math.random() - 0.5) * 2,
    volume24h: token.volume24h * (1 + (Math.random() - 0.5) * 0.1),
    lastUpdate: Date.now()
  }));
}
