import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MarketSummary from '../components/MarketSummary';
import PortfolioChart from '../components/PortfolioChart';
import StockTrendChart from '../components/StockTrendChart';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer
} from 'recharts';
import { getPortfolio } from '../services/portfolioService';
import { generateSimulatedPrice } from '../utils/marketData';

export default function Market() {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPortfolio();
        const enriched = data.map(s => ({
          ...s,
          currentPrice: generateSimulatedPrice(s.stockSymbol, s.buyPrice),
          profitLoss: parseFloat(
            ((generateSimulatedPrice(s.stockSymbol, s.buyPrice) - s.buyPrice) * s.quantity).toFixed(2)
          ),
        }));
        setPortfolio(enriched);
        if (enriched.length > 0) setSelectedStock(enriched[0]);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const gainLossData = portfolio.map(s => ({
    name: s.stockSymbol,
    pl: s.profitLoss,
  }));

  return (
    <div className="app-layout">
      <Navbar />
      <div className="page-content">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h2 className="page-title">
              <span className="neon-text">Market</span> Analytics
            </h2>
            <p className="page-desc">Live portfolio analytics & market data</p>
          </div>
          <div className="market-timestamp">
            🟢 Simulated Live Data · {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Market Index Summary */}
        <MarketSummary />

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Fetching market data...</p>
          </div>
        ) : portfolio.length === 0 ? (
          <div className="empty-state glass-card">
            <div className="empty-icon">📈</div>
            <p>Add stocks to see market analytics.</p>
            <a href="/add-stock" className="btn-primary">Add Your First Stock</a>
          </div>
        ) : (
          <>
            {/* Charts Row */}
            <div className="charts-grid">
              {/* Stock selector + Trend Chart */}
              <div className="chart-section">
                <div className="stock-selector">
                  {portfolio.map(s => (
                    <button
                      key={s.id}
                      className={`selector-btn ${selectedStock?.id === s.id ? 'active' : ''}`}
                      onClick={() => setSelectedStock(s)}
                    >
                      {s.stockSymbol}
                    </button>
                  ))}
                </div>
                {selectedStock && <StockTrendChart stock={selectedStock} />}
              </div>

              {/* Portfolio Pie */}
              <PortfolioChart portfolio={portfolio} />
            </div>

            {/* Gain/Loss Bar Chart */}
            <div className="glass-card chart-container">
              <h3 className="chart-title">Gain / Loss by Position</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={gainLossData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} tickFormatter={v => `$${v}`} />
                  <Tooltip
                    formatter={(value) => [`${value >= 0 ? '+' : ''}$${value.toFixed(2)}`, 'P&L']}
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8' }}
                  />
                  <Bar dataKey="pl" radius={[6, 6, 0, 0]}>
                    {gainLossData.map((entry, index) => (
                      <Cell key={index} fill={entry.pl >= 0 ? '#22c55e' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Analytics Table */}
            <div className="glass-card table-card">
              <div className="table-header">
                <h3 className="table-title">Position Analytics</h3>
              </div>
              <div className="table-wrapper">
                <table className="portfolio-table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Qty</th>
                      <th>Buy Price</th>
                      <th>Current Price</th>
                      <th>Market Value</th>
                      <th>P&L ($)</th>
                      <th>P&L (%)</th>
                      <th>Signal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map(s => {
                      const plPct = (((s.currentPrice - s.buyPrice) / s.buyPrice) * 100).toFixed(2);
                      const isProfit = s.profitLoss >= 0;
                      return (
                        <tr key={s.id} className="table-row"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedStock(s)}
                        >
                          <td><span className="symbol-badge">{s.stockSymbol}</span></td>
                          <td>{s.quantity}</td>
                          <td>${s.buyPrice?.toFixed(2)}</td>
                          <td className="neon-text">${s.currentPrice?.toFixed(2)}</td>
                          <td>${(s.currentPrice * s.quantity).toFixed(2)}</td>
                          <td className={isProfit ? 'profit-text' : 'loss-text'}>
                            {isProfit ? '+' : ''}${s.profitLoss?.toFixed(2)}
                          </td>
                          <td className={isProfit ? 'profit-text' : 'loss-text'}>
                            {isProfit ? '+' : ''}{plPct}%
                          </td>
                          <td>
                            <span className={`signal-badge ${isProfit ? 'signal-buy' : 'signal-sell'}`}>
                              {isProfit ? 'BUY' : 'SELL'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
