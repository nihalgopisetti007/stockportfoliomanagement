import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { addStock } from '../services/portfolioService';

export default function AddStock() {
  const [stockSymbol, setStockSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const POPULAR_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await addStock(stockSymbol.toUpperCase(), parseInt(quantity), parseFloat(buyPrice));
      setSuccess(`✓ ${stockSymbol.toUpperCase()} added to portfolio!`);
      setTimeout(() => navigate('/portfolio'), 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add stock.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">
            <span className="title-accent">+</span> Add New Position
          </h2>
          <p className="page-desc">Enter stock details to add to your portfolio</p>
        </div>

        <div className="add-stock-grid">
          <div className="glass-card add-stock-card">
            <form onSubmit={handleSubmit} className="add-stock-form">
              <div className="form-group">
                <label className="form-label">Stock Symbol</label>
                <input
                  className="form-input"
                  placeholder="e.g. AAPL"
                  value={stockSymbol}
                  onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                  required
                />
                <div className="quick-symbols">
                  {POPULAR_SYMBOLS.map(sym => (
                    <button
                      key={sym}
                      type="button"
                      className="symbol-chip"
                      onClick={() => setStockSymbol(sym)}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Quantity (Shares)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="10"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Buy Price ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="150.00"
                    min="0.01"
                    step="0.01"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && <div className="auth-error">{error}</div>}
              {success && <div className="auth-success">{success}</div>}
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => navigate('/portfolio')}>
                  ← Cancel
                </button>
                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? <span className="spinner"></span> : '📈 Add Position'}
                </button>
              </div>
            </form>
          </div>

          <div className="glass-card add-stock-info">
            <h3 className="info-title">Trade Info</h3>
            {stockSymbol && quantity && buyPrice ? (
              <div className="trade-preview">
                <div className="preview-row">
                  <span>Symbol</span>
                  <span className="neon-text">{stockSymbol}</span>
                </div>
                <div className="preview-row">
                  <span>Shares</span>
                  <span>{quantity}</span>
                </div>
                <div className="preview-row">
                  <span>Price Per Share</span>
                  <span>${parseFloat(buyPrice || 0).toFixed(2)}</span>
                </div>
                <div className="preview-row highlight">
                  <span>Total Investment</span>
                  <span className="neon-text">${(quantity * buyPrice).toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <p className="info-placeholder">Fill in the form to preview your trade</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
