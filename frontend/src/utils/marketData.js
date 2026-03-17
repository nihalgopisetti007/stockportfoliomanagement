/**
 * Generates deterministic simulated market data for demo purposes.
 * Uses the stock symbol as a seed for consistent but varied results.
 */

const MARKET_MULTIPLIERS = {
  AAPL: 1.08, GOOGL: 0.95, MSFT: 1.12, AMZN: 0.88, TSLA: 1.25,
  NVDA: 1.35, META: 1.18, NFLX: 0.92, AMD: 1.22, INTC: 0.78,
  JPM: 1.04,  BAC: 0.97, GS: 1.06, V: 1.09, MA: 1.11,
};

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function symbolSeed(symbol) {
  return symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

export function generateSimulatedPrice(symbol, buyPrice) {
  const multiplier = MARKET_MULTIPLIERS[symbol] || (1 + (seededRandom(symbolSeed(symbol)) - 0.5) * 0.3);
  const noise = 1 + (seededRandom(symbolSeed(symbol) * 7.3) - 0.5) * 0.04;
  return parseFloat((buyPrice * multiplier * noise).toFixed(2));
}

export function generateTrendData(symbol, buyPrice, days = 30) {
  const seed = symbolSeed(symbol);
  const finalMultiplier = MARKET_MULTIPLIERS[symbol] || 1.0;
  const data = [];
  let price = buyPrice;

  for (let i = 0; i < days; i++) {
    const trend = (finalMultiplier - 1) / days;
    const noise = (seededRandom(seed + i * 13.7) - 0.5) * 0.04;
    price = price * (1 + trend + noise);
    data.push({
      day: `Day ${i + 1}`,
      price: parseFloat(price.toFixed(2)),
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
  }
  return data;
}

export function generateMarketSummary() {
  const indices = [
    { name: 'S&P 500', value: 5248.32, change: 0.72 },
    { name: 'NASDAQ', value: 18542.18, change: 1.14 },
    { name: 'DOW', value: 39487.52, change: -0.23 },
    { name: 'VIX', value: 14.38, change: -3.21 },
  ];
  return indices;
}
