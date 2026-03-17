import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPortfolio, deleteStock } from '../services/portfolioService';
import { generateSimulatedPrice } from '../utils/marketData';

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchPortfolio = async () => {
    try {
      const data = await getPortfolio();
      const enriched = data.map(s => ({
        ...s,
        currentPrice: generateSimulatedPrice(s.stockSymbol, s.buyPrice),
      }));
      setPortfolio(enriched);
    } catch {
      setError('Failed to load portfolio.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPortfolio(); }, []);

  const handleDelete = async (id) => {
    try {
      await deleteStock(id);
      setPortfolio(prev => prev.filter(s => s.id !== id));
    } catch {
      setError('Failed to delete stock.');
    }
  };

  const totalValue = portfolio.reduce((sum, s) => sum + s.currentPrice * s.quantity, 0);
  const totalCost = portfolio.reduce((sum, s) => sum + s.buyPrice * s.quantity, 0);
  const totalPL = totalValue - totalCost;
  const totalPLPct = totalCost > 0 ? ((totalPL / totalCost) * 100).toFixed(2) : '0.00';

  return (
    <div className="app-layout">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <div>
            <h2 className="page-title">Welcome back, <span className="neon-text">{user.name || 'Trader'}</span></h2>
            <p className="page-desc">Your portfolio overview</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/add-stock')}>
            + Add Position
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-label">Total Portfolio Value</div>
            <div className="summary-value neon-text">${totalValue.toFixed(2)}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Total Invested</div>
            <div className="summary-value">${totalCost.toFixed(2)}</div>
          </div>
          <div className={`summary-card ${totalPL >= 0 ? 'profit-card' : 'loss-card'}`}>
            <div className="summary-label">Total P&L</div>
            <div className={`summary-value ${totalPL >= 0 ? 'profit-text' : 'loss-text'}`}>
              {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
            </div>
          </div>
          <div className={`summary-card ${totalPL >= 0 ? 'profit-card' : 'loss-card'}`}>
            <div className="summary-label">Return</div>
            <div className={`summary-value ${totalPL >= 0 ? 'profit-text' : 'loss-text'}`}>
              {totalPL >= 0 ? '+' : ''}{totalPLPct}%
            </div>
          </div>
        </div>

        {/* Portfolio Table */}
        <div className="glass-card table-card">
          <div className="table-header">
            <h3 className="table-title">Holdings</h3>
            <span className="table-badge">{portfolio.length} positions</span>
          </div>
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading portfolio...</p>
            </div>
          ) : error ? (
            <div className="auth-error">{error}</div>
          ) : portfolio.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <p>No positions yet.</p>
              <button className="btn-primary" onClick={() => navigate('/add-stock')}>
                Add Your First Stock
              </button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="portfolio-table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Quantity</th>
                    <th>Buy Price</th>
                    <th>Current Price</th>
                    <th>Market Value</th>
                    <th>P&L</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((stock) => {
                    const pl = ((stock.currentPrice - stock.buyPrice) * stock.quantity);
                    const plPct = (((stock.currentPrice - stock.buyPrice) / stock.buyPrice) * 100).toFixed(2);
                    const isProfit = pl >= 0;
                    return (
                      <tr key={stock.id} className="table-row">
                        <td>
                          <div className="symbol-cell">
                            <span className="symbol-badge">{stock.stockSymbol}</span>
                          </div>
                        </td>
                        <td>{stock.quantity}</td>
                        <td>${stock.buyPrice?.toFixed(2)}</td>
                        <td className="neon-text">${stock.currentPrice?.toFixed(2)}</td>
                        <td>${(stock.currentPrice * stock.quantity).toFixed(2)}</td>
                        <td>
                          <span className={isProfit ? 'profit-text' : 'loss-text'}>
                            {isProfit ? '+' : ''}${pl.toFixed(2)}
                            <small className="pct-label"> ({isProfit ? '+' : ''}{plPct}%)</small>
                          </span>
                        </td>
                        <td>
                          <button className="delete-row-btn" onClick={() => handleDelete(stock.id)}>
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
