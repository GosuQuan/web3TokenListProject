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
}

export interface WebSocketMessage {
  type: 'initial' | 'update';
  data: Token[];
  timestamp: number;
}
