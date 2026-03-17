import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { generateTrendData } from '../utils/marketData';

export default function StockTrendChart({ stock }) {
  if (!stock) return null;
  const data = generateTrendData(stock.stockSymbol, stock.buyPrice, 30);
  const isUp = data[data.length - 1].price >= data[0].price;

  return (
    <div className="chart-container glass-card">
      <div className="chart-header">
        <h3 className="chart-title">
          {stock.stockSymbol} — 30-Day Trend
        </h3>
        <span className={`trend-badge ${isUp ? 'profit' : 'loss'}`}>
          {isUp ? '▲' : '▼'} {isUp ? 'Uptrend' : 'Downtrend'}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${stock.stockSymbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity={0.4} />
              <stop offset="95%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 11 }} interval={6} />
          <YAxis tick={{ fill: '#475569', fontSize: 11 }} domain={['auto', 'auto']}
            tickFormatter={(v) => `$${v.toFixed(0)}`} />
          <Tooltip
            formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8' }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={isUp ? '#22c55e' : '#ef4444'}
            strokeWidth={2}
            fill={`url(#grad-${stock.stockSymbol})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
