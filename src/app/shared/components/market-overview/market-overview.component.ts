import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { StockDataService } from '../../../core/services/stock-data.service';
import { MarketIndex, StockQuote } from '../../../core/models/stock.models';

@Component({
    selector: 'app-market-overview',
    standalone: true,
    imports: [CommonModule, DecimalPipe],
    template: `
        <div class="market-overview">
            <!-- Market Indices -->
            <div class="section-header">
                <h3 class="section-title">Market Indices</h3>
                <span class="last-update" *ngIf="lastUpdate()">
                    Updated: {{ lastUpdate() | date:'HH:mm:ss' }}
                </span>
            </div>
            <div class="indices-grid">
                @for (index of indices(); track index.symbol) {
                    <div class="index-card glass-card">
                        <div class="index-name">{{ index.name }}</div>
                        <div class="index-value">{{ index.value | number:'1.2-2' }}</div>
                        <div class="index-change" [class.positive]="index.change >= 0" [class.negative]="index.change < 0">
                            <span class="change-arrow">{{ index.change >= 0 ? '▲' : '▼' }}</span>
                            {{ index.change >= 0 ? '+' : '' }}{{ index.change | number:'1.2-2' }}
                            ({{ index.changePercent | number:'1.2-2' }}%)
                        </div>
                    </div>
                }
            </div>

            <!-- Top Stocks Grid -->
            <div class="section-header">
                <h3 class="section-title">Major Corporations</h3>
                <button class="refresh-btn" (click)="refreshData()" [disabled]="isLoading()">
                    <span class="refresh-icon" [class.spinning]="isLoading()">⟳</span>
                </button>
            </div>
            <div class="stocks-grid">
                @for (stock of stocks(); track stock.symbol) {
                    <div class="stock-card glass-card" [class.positive]="stock.change >= 0" [class.negative]="stock.change < 0">
                        <div class="stock-header">
                            <span class="stock-symbol">{{ stock.symbol }}</span>
                            <span class="stock-badge" [class.up]="stock.change >= 0" [class.down]="stock.change < 0">
                                {{ stock.change >= 0 ? '↑' : '↓' }}
                            </span>
                        </div>
                        <div class="stock-name">{{ stock.name }}</div>
                        <div class="stock-price">\${{ stock.price | number:'1.2-2' }}</div>
                        <div class="stock-metrics">
                            <div class="metric">
                                <span class="metric-label">Change</span>
                                <span class="metric-value" [class.positive]="stock.change >= 0" [class.negative]="stock.change < 0">
                                    {{ stock.change >= 0 ? '+' : '' }}{{ stock.changePercent | number:'1.2-2' }}%
                                </span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">High</span>
                                <span class="metric-value">\${{ stock.high | number:'1.2-2' }}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Low</span>
                                <span class="metric-value">\${{ stock.low | number:'1.2-2' }}</span>
                            </div>
                        </div>
                        <div class="stock-sparkline">
                            <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                                <path [attr.d]="getSparklinePath(stock)" 
                                      [attr.stroke]="stock.change >= 0 ? '#10b981' : '#ef4444'" 
                                      fill="none" 
                                      stroke-width="2"/>
                            </svg>
                        </div>
                    </div>
                }
            </div>

            <!-- Top Movers -->
            <div class="movers-section">
                <div class="movers-column">
                    <h4 class="mover-title positive">📈 Top Gainers</h4>
                    @for (stock of topGainers(); track stock.symbol) {
                        <div class="mover-item">
                            <span class="mover-symbol">{{ stock.symbol }}</span>
                            <span class="mover-change positive">+{{ stock.changePercent | number:'1.2-2' }}%</span>
                        </div>
                    }
                </div>
                <div class="movers-column">
                    <h4 class="mover-title negative">📉 Top Losers</h4>
                    @for (stock of topLosers(); track stock.symbol) {
                        <div class="mover-item">
                            <span class="mover-symbol">{{ stock.symbol }}</span>
                            <span class="mover-change negative">{{ stock.changePercent | number:'1.2-2' }}%</span>
                        </div>
                    }
                </div>
            </div>
        </div>
    `,
    styles: [`
        .market-overview {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .section-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0;
        }

        .last-update {
            font-size: 0.75rem;
            color: var(--text-muted);
        }

        .refresh-btn {
            background: rgba(139, 92, 246, 0.1);
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 8px;
            padding: 8px 12px;
            color: var(--color-primary);
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .refresh-btn:hover:not(:disabled) {
            background: rgba(139, 92, 246, 0.2);
        }

        .refresh-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .refresh-icon {
            font-size: 16px;
            display: inline-block;
        }

        .refresh-icon.spinning {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* Indices Grid */
        .indices-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
        }

        .index-card {
            padding: 1.25rem;
            text-align: center;
        }

        .index-name {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
        }

        .index-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
            font-family: 'JetBrains Mono', monospace;
        }

        .index-change {
            font-size: 0.875rem;
            font-weight: 500;
            margin-top: 0.5rem;
        }

        .index-change.positive { color: #10b981; }
        .index-change.negative { color: #ef4444; }

        .change-arrow {
            font-size: 0.75rem;
        }

        /* Stocks Grid */
        .stocks-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
        }

        .stock-card {
            padding: 1rem;
            position: relative;
            overflow: hidden;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stock-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .stock-card.positive {
            border-left: 3px solid #10b981;
        }

        .stock-card.negative {
            border-left: 3px solid #ef4444;
        }

        .stock-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }

        .stock-symbol {
            font-size: 1rem;
            font-weight: 700;
            color: var(--text-primary);
        }

        .stock-badge {
            font-size: 0.75rem;
            padding: 2px 6px;
            border-radius: 4px;
        }

        .stock-badge.up {
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
        }

        .stock-badge.down {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
        }

        .stock-name {
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-bottom: 0.75rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .stock-price {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--text-primary);
            font-family: 'JetBrains Mono', monospace;
            margin-bottom: 0.75rem;
        }

        .stock-metrics {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.5rem;
            margin-bottom: 0.75rem;
        }

        .metric {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .metric-label {
            font-size: 0.65rem;
            color: var(--text-muted);
            text-transform: uppercase;
        }

        .metric-value {
            font-size: 0.75rem;
            color: var(--text-secondary);
            font-family: 'JetBrains Mono', monospace;
        }

        .metric-value.positive { color: #10b981; }
        .metric-value.negative { color: #ef4444; }

        .stock-sparkline {
            height: 30px;
            opacity: 0.7;
        }

        .stock-sparkline svg {
            width: 100%;
            height: 100%;
        }

        /* Movers Section */
        .movers-section {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        }

        .movers-column {
            background: rgba(15, 10, 31, 0.5);
            border: 1px solid rgba(139, 92, 246, 0.15);
            border-radius: 12px;
            padding: 1rem;
        }

        .mover-title {
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
        }

        .mover-title.positive { color: #10b981; }
        .mover-title.negative { color: #ef4444; }

        .mover-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(139, 92, 246, 0.1);
        }

        .mover-item:last-child {
            border-bottom: none;
        }

        .mover-symbol {
            font-weight: 600;
            color: var(--text-primary);
        }

        .mover-change {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.875rem;
            font-weight: 500;
        }

        .mover-change.positive { color: #10b981; }
        .mover-change.negative { color: #ef4444; }

        @media (max-width: 768px) {
            .indices-grid {
                grid-template-columns: 1fr;
            }

            .stocks-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .movers-section {
                grid-template-columns: 1fr;
            }
        }
    `]
})
export class MarketOverviewComponent implements OnInit {
    indices = signal<MarketIndex[]>([]);
    stocks = signal<StockQuote[]>([]);
    isLoading = signal(false);
    lastUpdate = signal<Date | null>(null);

    topGainers = signal<StockQuote[]>([]);
    topLosers = signal<StockQuote[]>([]);

    constructor(private stockService: StockDataService) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.isLoading.set(true);

        // Load indices
        this.stockService.getMarketIndices().subscribe({
            next: (data) => this.indices.set(data)
        });

        // Load stocks
        this.stockService.getTopStocks().subscribe({
            next: (data) => {
                this.stocks.set(data);
                this.lastUpdate.set(new Date());
                this.isLoading.set(false);
                this.calculateMovers(data);
            },
            error: () => this.isLoading.set(false)
        });
    }

    refreshData(): void {
        this.loadData();
    }

    private calculateMovers(stocks: StockQuote[]): void {
        const sorted = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
        this.topGainers.set(sorted.filter(s => s.changePercent > 0).slice(0, 3));
        this.topLosers.set(sorted.filter(s => s.changePercent < 0).slice(-3).reverse());
    }

    getSparklinePath(stock: StockQuote): string {
        // Generate a simple sparkline based on stock data
        const points = 20;
        const height = 30;
        const basePrice = stock.previousClose || stock.price;
        const priceRange = Math.abs(stock.high - stock.low) || 1;

        let path = '';
        for (let i = 0; i < points; i++) {
            const x = (i / (points - 1)) * 100;
            // Simulate price movement towards current price
            const progress = i / (points - 1);
            const targetPrice = basePrice + (stock.price - basePrice) * progress;
            const noise = (Math.random() - 0.5) * priceRange * 0.3;
            const price = targetPrice + noise;
            const y = height - ((price - stock.low) / priceRange) * height;

            if (i === 0) {
                path = `M ${x} ${Math.max(0, Math.min(height, y))}`;
            } else {
                path += ` L ${x} ${Math.max(0, Math.min(height, y))}`;
            }
        }
        return path;
    }
}
