import React from 'react';
import { generateMarketSummary } from '../utils/marketData';

export default function MarketSummary() {
  const indices = generateMarketSummary();

  return (
    <div className="market-summary-row">
      {indices.map((idx) => {
        const isUp = idx.change >= 0;
        return (
          <div key={idx.name} className={`market-index-card glass-card ${isUp ? 'index-up' : 'index-down'}`}>
            <div className="index-name">{idx.name}</div>
            <div className="index-value">{idx.value.toLocaleString()}</div>
            <div className={`index-change ${isUp ? 'profit-text' : 'loss-text'}`}>
              {isUp ? '▲' : '▼'} {Math.abs(idx.change)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
