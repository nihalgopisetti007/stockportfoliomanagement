import api from './api';

export const addStock = async (stockSymbol, quantity, buyPrice) => {
  const response = await api.post('/portfolio/add', { stockSymbol, quantity, buyPrice });
  return response.data;
};

export const getPortfolio = async () => {
  const response = await api.get('/portfolio');
  return response.data;
};

export const deleteStock = async (id) => {
  const response = await api.delete(`/portfolio/${id}`);
  return response.data;
};
