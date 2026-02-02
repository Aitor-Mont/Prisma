// Stock market data models

export interface StockQuote {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
    volume: number;
    timestamp: number;
    marketCap?: number;
}

export interface MarketIndex {
    symbol: string;
    name: string;
    value: number;
    change: number;
    changePercent: number;
    timestamp: number;
}

export interface CompanyInfo {
    symbol: string;
    name: string;
    sector: string;
    industry: string;
    description: string;
    logo: string;
    website: string;
    exchange: string;
    marketCap: number;
}

export interface StockCandle {
    c: number[];  // Close prices
    h: number[];  // High prices
    l: number[];  // Low prices
    o: number[];  // Open prices
    t: number[];  // Timestamps
    v: number[];  // Volumes
    s: string;    // Status
}

export interface MarketNews {
    id: number;
    headline: string;
    summary: string;
    source: string;
    url: string;
    image: string;
    datetime: number;
    related: string;
}

// Top S&P 500 companies to track
export const TOP_STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'JPM', name: 'JPMorgan Chase' },
    { symbol: 'V', name: 'Visa Inc.' },
    { symbol: 'JNJ', name: 'Johnson & Johnson' }
];

export const MARKET_INDICES = [
    { symbol: '^GSPC', name: 'S&P 500' },
    { symbol: '^DJI', name: 'Dow Jones' },
    { symbol: '^IXIC', name: 'NASDAQ' }
];
