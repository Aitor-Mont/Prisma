import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { StockDataService } from '../../../core/services/stock-data.service';
import { StockQuote, MarketIndex } from '../../../core/models/stock.models';
import { Subscription, interval } from 'rxjs';

@Component({
    selector: 'app-stock-ticker',
    standalone: true,
    imports: [CommonModule, DecimalPipe],
    template: `
        <div class="stock-ticker-wrapper">
            <div class="ticker-label">
                <span class="live-dot" [class.live]="isLive()"></span>
                {{ isLive() ? 'LIVE' : 'DEMO' }}
            </div>
            <div class="ticker-scroll" [class.paused]="isPaused">
                <div class="ticker-content" (mouseenter)="isPaused = true" (mouseleave)="isPaused = false">
                    @for (stock of stocks(); track stock.symbol) {
                        <div class="ticker-item" (click)="selectStock(stock)">
                            <span class="ticker-symbol">{{ stock.symbol }}</span>
                            <span class="ticker-price">\${{ stock.price | number:'1.2-2' }}</span>
                            <span class="ticker-change" [class.positive]="stock.change >= 0" [class.negative]="stock.change < 0">
                                {{ stock.change >= 0 ? '+' : '' }}{{ stock.changePercent | number:'1.2-2' }}%
                            </span>
                        </div>
                    }
                    <!-- Duplicate for seamless scroll -->
                    @for (stock of stocks(); track stock.symbol + '_dup') {
                        <div class="ticker-item" (click)="selectStock(stock)">
                            <span class="ticker-symbol">{{ stock.symbol }}</span>
                            <span class="ticker-price">\${{ stock.price | number:'1.2-2' }}</span>
                            <span class="ticker-change" [class.positive]="stock.change >= 0" [class.negative]="stock.change < 0">
                                {{ stock.change >= 0 ? '+' : '' }}{{ stock.changePercent | number:'1.2-2' }}%
                            </span>
                        </div>
                    }
                </div>
            </div>
        </div>
    `,
    styles: [`
        .stock-ticker-wrapper {
            display: flex;
            align-items: center;
            background: linear-gradient(90deg, rgba(15, 10, 31, 0.95), rgba(30, 20, 60, 0.9));
            border: 1px solid rgba(139, 92, 246, 0.2);
            border-radius: 12px;
            overflow: hidden;
            padding: 0;
            margin-bottom: 1.5rem;
        }

        .ticker-label {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: rgba(139, 92, 246, 0.15);
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.1em;
            color: var(--color-primary);
            white-space: nowrap;
            border-right: 1px solid rgba(139, 92, 246, 0.2);
        }

        .live-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #666;
        }

        .live-dot.live {
            background: #10b981;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
            50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
        }

        .ticker-scroll {
            flex: 1;
            overflow: hidden;
            position: relative;
        }

        .ticker-content {
            display: flex;
            animation: scroll 40s linear infinite;
            width: max-content;
        }

        .ticker-scroll.paused .ticker-content {
            animation-play-state: paused;
        }

        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }

        .ticker-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 20px;
            cursor: pointer;
            transition: background 0.2s ease;
            white-space: nowrap;
        }

        .ticker-item:hover {
            background: rgba(139, 92, 246, 0.1);
        }

        .ticker-symbol {
            font-weight: 700;
            color: var(--text-primary);
            font-size: 13px;
        }

        .ticker-price {
            color: var(--text-secondary);
            font-size: 13px;
            font-family: 'JetBrains Mono', monospace;
        }

        .ticker-change {
            font-size: 12px;
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', monospace;
        }

        .ticker-change.positive {
            color: #10b981;
            background: rgba(16, 185, 129, 0.15);
        }

        .ticker-change.negative {
            color: #ef4444;
            background: rgba(239, 68, 68, 0.15);
        }
    `]
})
export class StockTickerComponent implements OnInit, OnDestroy {
    stocks = signal<StockQuote[]>([]);
    isLive = signal(false);
    isPaused = false;

    private updateSubscription?: Subscription;

    constructor(private stockService: StockDataService) { }

    ngOnInit(): void {
        this.loadStocks();
        this.startAutoUpdate();
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    private loadStocks(): void {
        this.stockService.getTopStocks().subscribe({
            next: (data) => {
                this.stocks.set(data);
                this.isLive.set(this.stockService.isLiveData());
            },
            error: (err) => console.error('Failed to load stocks:', err)
        });
    }

    private startAutoUpdate(): void {
        // Update every 30 seconds
        this.updateSubscription = interval(30000).subscribe(() => {
            this.loadStocks();
        });
    }

    selectStock(stock: StockQuote): void {
        console.log('Selected stock:', stock);
        // Could emit an event or navigate to stock detail
    }
}
