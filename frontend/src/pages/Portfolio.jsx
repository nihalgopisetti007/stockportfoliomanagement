import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import StockCard from '../components/StockCard';
import { getPortfolio, deleteStock } from '../services/portfolioService';
import { generateSimulatedPrice } from '../utils/marketData';

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = window.history;

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteStock(id);
      setPortfolio(prev => prev.filter(s => s.id !== id));
    } catch {
      setError('Failed to delete stock.');
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <div>
            <h2 className="page-title">My <span className="neon-text">Portfolio</span></h2>
            <p className="page-desc">All your active positions</p>
          </div>
          <a href="/add-stock" className="btn-primary">+ Add Position</a>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading portfolio...</p>
          </div>
        ) : error ? (
          <div className="auth-error">{error}</div>
        ) : portfolio.length === 0 ? (
          <div className="empty-state glass-card">
            <div className="empty-icon">📊</div>
            <p>No positions yet. Add your first stock to get started.</p>
            <a href="/add-stock" className="btn-primary">Add Stock</a>
          </div>
        ) : (
          <div className="stock-cards-grid">
            {portfolio.map(stock => (
              <StockCard key={stock.id} stock={stock} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
