import React from 'react';

export default function StockCard({ stock, onDelete }) {
  const currentPrice = stock.currentPrice || stock.buyPrice;
  const profitLoss = ((currentPrice - stock.buyPrice) * stock.quantity).toFixed(2);
  const pnlPercent = (((currentPrice - stock.buyPrice) / stock.buyPrice) * 100).toFixed(2);
  const isProfit = profitLoss >= 0;

  return (
    <div className="stock-card">
      <div className="stock-card-header">
        <span className="stock-symbol">{stock.stockSymbol}</span>
        <span className={`pnl-badge ${isProfit ? 'profit' : 'loss'}`}>
          {isProfit ? '▲' : '▼'} {Math.abs(pnlPercent)}%
        </span>
      </div>
      <div className="stock-card-body">
        <div className="stock-detail">
          <span className="label">Qty</span>
          <span className="value">{stock.quantity}</span>
        </div>
        <div className="stock-detail">
          <span className="label">Buy Price</span>
          <span className="value">${stock.buyPrice?.toFixed(2)}</span>
        </div>
        <div className="stock-detail">
          <span className="label">Current</span>
          <span className="value">${currentPrice?.toFixed(2)}</span>
        </div>
        <div className="stock-detail">
          <span className="label">P/L</span>
          <span className={`value ${isProfit ? 'profit-text' : 'loss-text'}`}>
            {isProfit ? '+' : ''}${profitLoss}
          </span>
        </div>
      </div>
      <button className="delete-btn" onClick={() => onDelete(stock.id)}>
        ✕ Remove
      </button>
    </div>
  );
}
