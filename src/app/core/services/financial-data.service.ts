import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, interval, switchMap, catchError, map } from 'rxjs';
import { CryptoData } from '../models/financial.models';

@Injectable({
    providedIn: 'root'
})
export class FinancialDataService {

    private readonly COINGECKO_API = 'https://api.coingecko.com/api/v3';

    // Signal to track loading state
    isLoading = signal(false);

    // Signal to track if using live data
    isLiveData = signal(false);

    constructor(private http: HttpClient) { }

    /**
     * Fetch top cryptocurrencies from CoinGecko API
     * No API key required for basic usage
     */
    getCryptoMarketData(limit: number = 10): Observable<CryptoData[]> {
        this.isLoading.set(true);

        const url = `${this.COINGECKO_API}/coins/markets`;
        const params = {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: limit.toString(),
            page: '1',
            sparkline: 'true',
            price_change_percentage: '24h,7d'
        };

        return this.http.get<CryptoData[]>(url, { params }).pipe(
            map(data => {
                this.isLoading.set(false);
                this.isLiveData.set(true);
                return data;
            }),
            catchError(error => {
                console.warn('CoinGecko API error, using mock data:', error);
                this.isLoading.set(false);
                this.isLiveData.set(false);
                return of(this.getMockCryptoData());
            })
        );
    }

    /**
     * Get simple price for a specific coin
     */
    getCoinPrice(coinId: string): Observable<{ [key: string]: { usd: number; usd_24h_change: number } }> {
        const url = `${this.COINGECKO_API}/simple/price`;
        const params = {
            ids: coinId,
            vs_currencies: 'usd',
            include_24hr_change: 'true'
        };

        return this.http.get<any>(url, { params });
    }

    /**
     * Get trending coins
     */
    getTrendingCoins(): Observable<any> {
        return this.http.get(`${this.COINGECKO_API}/search/trending`);
    }

    /**
     * Start polling for real-time updates every 30 seconds
     */
    startRealTimeUpdates(intervalMs: number = 30000): Observable<CryptoData[]> {
        return interval(intervalMs).pipe(
            switchMap(() => this.getCryptoMarketData())
        );
    }

    /**
     * Mock crypto data for demo/fallback
     */
    private getMockCryptoData(): CryptoData[] {
        return [
            {
                id: 'bitcoin',
                symbol: 'btc',
                name: 'Bitcoin',
                image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
                current_price: 43250.00,
                market_cap: 847000000000,
                market_cap_rank: 1,
                price_change_percentage_24h: 2.45,
                total_volume: 28500000000,
                sparkline_in_7d: {
                    price: this.generateSparkline(168, 41000, 44000)
                }
            },
            {
                id: 'ethereum',
                symbol: 'eth',
                name: 'Ethereum',
                image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
                current_price: 2280.50,
                market_cap: 274000000000,
                market_cap_rank: 2,
                price_change_percentage_24h: 1.82,
                total_volume: 12800000000,
                sparkline_in_7d: {
                    price: this.generateSparkline(168, 2100, 2350)
                }
            },
            {
                id: 'solana',
                symbol: 'sol',
                name: 'Solana',
                image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
                current_price: 98.45,
                market_cap: 42000000000,
                market_cap_rank: 5,
                price_change_percentage_24h: 5.21,
                total_volume: 2100000000,
                sparkline_in_7d: {
                    price: this.generateSparkline(168, 85, 105)
                }
            },
            {
                id: 'cardano',
                symbol: 'ada',
                name: 'Cardano',
                image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
                current_price: 0.52,
                market_cap: 18500000000,
                market_cap_rank: 8,
                price_change_percentage_24h: -1.25,
                total_volume: 450000000,
                sparkline_in_7d: {
                    price: this.generateSparkline(168, 0.48, 0.55)
                }
            },
            {
                id: 'polkadot',
                symbol: 'dot',
                name: 'Polkadot',
                image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
                current_price: 7.85,
                market_cap: 9800000000,
                market_cap_rank: 12,
                price_change_percentage_24h: 3.45,
                total_volume: 320000000,
                sparkline_in_7d: {
                    price: this.generateSparkline(168, 7.2, 8.1)
                }
            }
        ];
    }

    /**
     * Generate sparkline data for charts
     */
    private generateSparkline(points: number, min: number, max: number): number[] {
        const data: number[] = [];
        let current = min + Math.random() * (max - min);

        for (let i = 0; i < points; i++) {
            const change = (Math.random() - 0.5) * (max - min) * 0.1;
            current = Math.max(min, Math.min(max, current + change));
            data.push(current);
        }

        return data;
    }
}
