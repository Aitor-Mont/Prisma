// Financial data models for Prisma Dashboard

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  total_volume: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface TimeSeriesData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
    fill?: boolean;
  }[];
}

export interface Transaction {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'transfer';
  status: 'completed' | 'pending' | 'failed' | 'processing';
  amount: number;
  date: string;
  icon?: string;
  category?: string;
}

export interface KPIMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: 'cyan' | 'purple' | 'green' | 'pink';
}

export interface GlobalActivityData {
  day: string;
  hour: number;
  value: number; // 0-1 intensity
}

export interface PortfolioAsset {
  symbol: string;
  name: string;
  allocation: number;
  value: number;
  change24h: number;
  type: 'crypto' | 'stock' | 'bond' | 'commodity';
}
