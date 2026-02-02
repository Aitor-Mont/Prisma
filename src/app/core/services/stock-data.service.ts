import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, interval, map, catchError, forkJoin, switchMap } from 'rxjs';
import { StockQuote, MarketIndex, StockCandle, TOP_STOCKS, MARKET_INDICES } from '../models/stock.models';

@Injectable({
    providedIn: 'root'
})
export class StockDataService {
    // Using FinnHub free API - https://finnhub.io/
    private readonly FINNHUB_API = 'https://finnhub.io/api/v1';
    private readonly API_KEY = 'demo'; // Free demo key, replace with actual key for production

    // Alternative: Alpha Vantage - https://www.alphavantage.co/
    private readonly ALPHAVANTAGE_API = 'https://www.alphavantage.co/query';

    isLoading = signal(false);
    isLiveData = signal(false);
    lastUpdate = signal<Date | null>(null);

    constructor(private http: HttpClient) { }

    /**
     * Get real-time quote for a single stock using FinnHub
     */
    getStockQuote(symbol: string): Observable<StockQuote> {
        this.isLoading.set(true);

        const url = `${this.FINNHUB_API}/quote`;
        const params = {
            symbol: symbol,
            token: this.API_KEY
        };

        return this.http.get<any>(url, { params }).pipe(
            map(data => {
                this.isLoading.set(false);
                this.isLiveData.set(true);
                this.lastUpdate.set(new Date());

                const stockInfo = TOP_STOCKS.find(s => s.symbol === symbol);
                return {
                    symbol: symbol,
                    name: stockInfo?.name || symbol,
                    price: data.c,
                    change: data.d,
                    changePercent: data.dp,
                    high: data.h,
                    low: data.l,
                    open: data.o,
                    previousClose: data.pc,
                    volume: 0,
                    timestamp: data.t * 1000
                };
            }),
            catchError(error => {
                console.warn(`FinnHub API error for ${symbol}, using mock data:`, error);
                this.isLoading.set(false);
                this.isLiveData.set(false);
                return of(this.getMockStockQuote(symbol));
            })
        );
    }

    /**
     * Get quotes for multiple stocks
     */
    getMultipleQuotes(symbols: string[] = TOP_STOCKS.map(s => s.symbol)): Observable<StockQuote[]> {
        const requests = symbols.map(symbol => this.getStockQuote(symbol));
        return forkJoin(requests);
    }

    /**
     * Get all top stocks data
     */
    getTopStocks(): Observable<StockQuote[]> {
        return this.getMultipleQuotes(TOP_STOCKS.map(s => s.symbol));
    }

    /**
     * Get market indices (S&P 500, NASDAQ, DOW)
     */
    getMarketIndices(): Observable<MarketIndex[]> {
        // FinnHub doesn't support indices in free tier, use mock data
        return of(this.getMockMarketIndices());
    }

    /**
     * Start real-time updates polling every 30 seconds
     */
    startRealTimeUpdates(intervalMs: number = 30000): Observable<StockQuote[]> {
        return interval(intervalMs).pipe(
            switchMap(() => this.getTopStocks())
        );
    }

    /**
     * Get stock candle data for charting
     */
    getStockCandles(symbol: string, resolution: string = 'D', from: number, to: number): Observable<StockCandle> {
        const url = `${this.FINNHUB_API}/stock/candle`;
        const params = {
            symbol: symbol,
            resolution: resolution,
            from: from.toString(),
            to: to.toString(),
            token: this.API_KEY
        };

        return this.http.get<StockCandle>(url, { params }).pipe(
            catchError(error => {
                console.warn('Stock candle API error, using mock data:', error);
                return of(this.getMockCandleData());
            })
        );
    }

    // ==================== MOCK DATA ====================

    private getMockStockQuote(symbol: string): StockQuote {
        const mockData: Record<string, Partial<StockQuote>> = {
            'AAPL': { price: 178.50, change: 2.35, changePercent: 1.33, high: 180.20, low: 176.80 },
            'MSFT': { price: 378.25, change: -1.50, changePercent: -0.40, high: 381.00, low: 375.50 },
            'GOOGL': { price: 141.80, change: 3.20, changePercent: 2.31, high: 143.50, low: 139.00 },
            'AMZN': { price: 178.90, change: 4.10, changePercent: 2.35, high: 180.00, low: 175.50 },
            'NVDA': { price: 495.20, change: 12.50, changePercent: 2.59, high: 502.00, low: 485.00 },
            'META': { price: 485.30, change: -5.20, changePercent: -1.06, high: 492.00, low: 482.50 },
            'TSLA': { price: 248.75, change: 8.90, changePercent: 3.71, high: 255.00, low: 242.00 },
            'JPM': { price: 195.40, change: 1.20, changePercent: 0.62, high: 197.00, low: 193.50 },
            'V': { price: 275.60, change: 0.80, changePercent: 0.29, high: 277.00, low: 274.00 },
            'JNJ': { price: 156.20, change: -0.40, changePercent: -0.26, high: 157.50, low: 155.00 }
        };

        const stockInfo = TOP_STOCKS.find(s => s.symbol === symbol);
        const mock = mockData[symbol] || { price: 100, change: 0, changePercent: 0, high: 102, low: 98 };

        // Add some randomness to simulate real-time changes
        const priceVariation = (Math.random() - 0.5) * 2;

        return {
            symbol: symbol,
            name: stockInfo?.name || symbol,
            price: (mock.price || 100) + priceVariation,
            change: mock.change || 0,
            changePercent: mock.changePercent || 0,
            high: mock.high || 102,
            low: mock.low || 98,
            open: (mock.price || 100) - (mock.change || 0),
            previousClose: (mock.price || 100) - (mock.change || 0),
            volume: Math.floor(Math.random() * 50000000) + 10000000,
            timestamp: Date.now()
        };
    }

    private getMockMarketIndices(): MarketIndex[] {
        return [
            {
                symbol: '^GSPC',
                name: 'S&P 500',
                value: 4927.50 + (Math.random() - 0.5) * 20,
                change: 15.30,
                changePercent: 0.31,
                timestamp: Date.now()
            },
            {
                symbol: '^DJI',
                name: 'Dow Jones',
                value: 38654.20 + (Math.random() - 0.5) * 100,
                change: 125.80,
                changePercent: 0.33,
                timestamp: Date.now()
            },
            {
                symbol: '^IXIC',
                name: 'NASDAQ',
                value: 15628.40 + (Math.random() - 0.5) * 50,
                change: 78.50,
                changePercent: 0.50,
                timestamp: Date.now()
            }
        ];
    }

    private getMockCandleData(): StockCandle {
        const now = Math.floor(Date.now() / 1000);
        const oneDay = 86400;
        const days = 30;

        const t: number[] = [];
        const o: number[] = [];
        const h: number[] = [];
        const l: number[] = [];
        const c: number[] = [];
        const v: number[] = [];

        let price = 150;

        for (let i = days; i >= 0; i--) {
            t.push(now - (i * oneDay));
            const open = price;
            const change = (Math.random() - 0.5) * 5;
            const close = open + change;
            const high = Math.max(open, close) + Math.random() * 2;
            const low = Math.min(open, close) - Math.random() * 2;

            o.push(open);
            c.push(close);
            h.push(high);
            l.push(low);
            v.push(Math.floor(Math.random() * 50000000));

            price = close;
        }

        return { t, o, h, l, c, v, s: 'ok' };
    }
}
