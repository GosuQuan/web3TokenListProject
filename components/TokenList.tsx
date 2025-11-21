import { Token } from '@/types/token';
import styles from '@/styles/TokenList.module.css';

interface TokenListProps {
  tokens: Token[];
  isConnected: boolean;
}

export default function TokenList({ tokens, isConnected }: TokenListProps) {
  const formatNumber = (num: number, decimals: number = 2): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const formatPrice = (price: number): string => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  const formatPercentage = (value: number): string => {
    const formatted = Math.abs(value).toFixed(2);
    return value >= 0 ? `+${formatted}%` : `-${formatted}%`;
  };

  const getChangeClass = (value: number): string => {
    if (value > 0) return styles.positive;
    if (value < 0) return styles.negative;
    return styles.neutral;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Trending Tokens</h1>
        <div className={styles.status}>
          <span className={`${styles.indicator} ${isConnected ? styles.connected : styles.disconnected}`} />
          <span>{isConnected ? 'Live' : 'Disconnected'}</span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thRank}>Rank</th>
              <th className={styles.thToken}>Token</th>
              <th className={styles.thChain}>Chain</th>
              <th className={styles.thPrice}>Price</th>
              <th className={styles.thChange}>1h %</th>
              <th className={styles.thChange}>24h %</th>
              <th className={styles.thVolume}>24h Vol</th>
              <th className={styles.thChange}>Vol %</th>
              <th className={styles.thMarketCap}>Market Cap</th>
              <th className={styles.thChange}>MC %</th>
              <th className={styles.thAge}>Age</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <tr key={token.rank} className={styles.row}>
                <td className={styles.rank}>{token.rank}</td>
                <td className={styles.token}>
                  <div className={styles.tokenInfo}>
                    <div className={styles.tokenIcon}>
                      {token.icon ? (
                        <img src={token.icon} alt={token.symbol} />
                      ) : (
                        <div className={styles.iconPlaceholder}>
                          {token.symbol.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className={styles.tokenDetails}>
                      <div className={styles.tokenSymbol}>{token.symbol}</div>
                      <div className={styles.tokenName}>{token.name}</div>
                    </div>
                  </div>
                </td>
                <td className={styles.chain}>{token.chain}</td>
                <td className={styles.price}>{formatPrice(token.price)}</td>
                <td className={getChangeClass(token.priceChange1h)}>
                  {formatPercentage(token.priceChange1h)}
                </td>
                <td className={getChangeClass(token.priceChange24h)}>
                  {formatPercentage(token.priceChange24h)}
                </td>
                <td className={styles.volume}>{formatNumber(token.volume24h)}</td>
                <td className={getChangeClass(token.volumeChange24h)}>
                  {formatPercentage(token.volumeChange24h)}
                </td>
                <td className={styles.marketCap}>{formatNumber(token.marketCap)}</td>
                <td className={getChangeClass(token.marketCapChange24h)}>
                  {formatPercentage(token.marketCapChange24h)}
                </td>
                <td className={styles.age}>{token.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
