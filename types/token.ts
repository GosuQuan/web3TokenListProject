/**
 * Token数据类型定义
 */
export interface TokenData {
  baseDecimals: number;
  baseName: string;
  baseSupply: number;
  baseSymbol: string;
  baseToken: string;
  buyCount24h: number;
  chainId: string;
  count24h: number;
  dex: string;
  info: {
    twitter: string;
    website: string;
    telegram: string;
  };
  liquidity: number;
  marketCap: number;
  pair: string;
  price: number;
  priceChange1h: number;
  priceChange1m: number;
  priceChange24h: number;
  priceChange5m: number;
  priceNative: number;
  priceUsd: number;
  quoteName: string;
  quoteSymbol: string;
  quoteToken: string;
  sellCount24h: number;
  timeDiff: string;
  volumeUsd24h: number;
}

/**
 * WebSocket消息类型定义
 */
export interface WebSocketMessage {
  msg?: string;
  code?: string;
  t?: number;
  data?: TokenData[];
  topic?: string;
  compression?: number;
  event?: string;
  interval?: string;
  pair?: string;
  chainId?: string;
  pong?: string;
}

// 前端展示用的 Token 结构
export interface Token {
  rank: number;
  name: string;
  symbol: string;
  icon?: string;
  chain: string;
  price: number;
  priceChange1h: number;
  priceChange24h: number;
  volume24h: number;
  volumeChange24h: number;
  marketCap: number;
  marketCapChange24h: number;
  holders: number;
  holdersChange24h: number;
  txns24h: number;
  txnsChange24h: number;
  age: string;
  lastUpdate?: number;
  // 额外字段
  dex?: string;
  liquidity?: number;
  pair?: string;
}
