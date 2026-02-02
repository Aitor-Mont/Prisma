import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { StockDataService } from '../../core/services/stock-data.service';
import { FinancialDataService } from '../../core/services/financial-data.service';
import { StockQuote } from '../../core/models/stock.models';
import { CryptoData } from '../../core/models/financial.models';
import { Chart, registerables } from 'chart.js';
import { Subscription, interval } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, HeaderComponent, DecimalPipe],
  template: `
    <app-header title="Analytics"></app-header>
    
    <div class="analytics-content">
      <div class="analytics-header">
        <h2>Market Analytics</h2>
        <p>Real-time market data and performance metrics</p>
        <div class="data-source">
          <span class="source-badge" [class.live]="isLiveData()">
            {{ isLiveData() ? '🟢 Live Data' : '🟡 Demo Data' }}
          </span>
          <span class="last-update" *ngIf="lastUpdate()">
            Last updated: {{ lastUpdate() | date:'HH:mm:ss' }}
          </span>
        </div>
      </div>

      <div class="analytics-grid">
        <!-- Portfolio Distribution -->
        <div class="analytics-card glass-card">
          <h3 class="card-title">Portfolio Distribution</h3>
          <div class="chart-container">
            <canvas id="portfolioChart"></canvas>
          </div>
        </div>

        <!-- Performance Chart -->
        <div class="analytics-card glass-card large">
          <h3 class="card-title">Performance Over Time</h3>
          <div class="chart-container">
            <canvas id="performanceChart"></canvas>
          </div>
        </div>

        <!-- Market Movers - Dynamic Data -->
        <div class="analytics-card glass-card">
          <h3 class="card-title">Top Movers</h3>
          <div class="movers-list">
            @for (stock of topStocks(); track stock.symbol) {
              <div class="mover-item">
                <div class="mover-info">
                  <span class="mover-symbol">{{ stock.symbol }}</span>
                  <span class="mover-name">{{ stock.name }}</span>
                </div>
                <div class="mover-price">\${{ stock.price | number:'1.2-2' }}</div>
                <div class="mover-change" [class.positive]="stock.changePercent > 0" [class.negative]="stock.changePercent < 0">
                  {{ stock.changePercent > 0 ? '+' : '' }}{{ stock.changePercent | number:'1.2-2' }}%
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Crypto Assets -->
        <div class="analytics-card glass-card">
          <h3 class="card-title">Crypto Assets</h3>
          <div class="crypto-list">
            @for (crypto of cryptoData(); track crypto.id) {
              <div class="crypto-item">
                <img [src]="crypto.image" [alt]="crypto.name" class="crypto-icon" />
                <div class="crypto-info">
                  <span class="crypto-symbol">{{ crypto.symbol | uppercase }}</span>
                  <span class="crypto-name">{{ crypto.name }}</span>
                </div>
                <div class="crypto-price">\${{ crypto.current_price | number:'1.2-2' }}</div>
                <div class="crypto-change" 
                     [class.positive]="crypto.price_change_percentage_24h > 0" 
                     [class.negative]="crypto.price_change_percentage_24h < 0">
                  {{ crypto.price_change_percentage_24h > 0 ? '+' : '' }}{{ crypto.price_change_percentage_24h | number:'1.2-2' }}%
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="analytics-card glass-card stats-card">
          <h3 class="card-title">Quick Stats</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Portfolio Value</span>
              <span class="stat-value">\${{ portfolioValue() | number:'1.2-2' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">24h Change</span>
              <span class="stat-value" [class.positive]="dailyChange() > 0" [class.negative]="dailyChange() < 0">
                {{ dailyChange() > 0 ? '+' : '' }}{{ dailyChange() | number:'1.2-2' }}%
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total Assets</span>
              <span class="stat-value">{{ totalAssets() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Profit/Loss</span>
              <span class="stat-value" [class.positive]="profitLoss() > 0" [class.negative]="profitLoss() < 0">
                {{ profitLoss() > 0 ? '+' : '' }}\${{ profitLoss() | number:'1.2-2' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-content {
      padding: var(--space-xl);
    }

    .analytics-header {
      margin-bottom: var(--space-xl);
    }

    .analytics-header h2 {
      font-size: var(--font-size-3xl);
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-sm);
    }

    .analytics-header p {
      color: var(--text-secondary);
    }

    .data-source {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      margin-top: var(--space-md);
    }

    .source-badge {
      font-size: var(--font-size-sm);
      padding: 4px 12px;
      background: rgba(245, 158, 11, 0.15);
      border-radius: var(--radius-full);
      color: var(--color-warning);
    }

    .source-badge.live {
      background: rgba(16, 185, 129, 0.15);
      color: var(--color-success);
    }

    .last-update {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-lg);
    }

    .analytics-card {
      padding: var(--space-lg);
    }

    .analytics-card.large {
      grid-column: span 2;
    }

    .card-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-lg);
    }

    .chart-container {
      height: 250px;
      position: relative;
    }

    .analytics-card.large .chart-container {
      height: 300px;
    }

    /* Movers List */
    .movers-list, .crypto-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .mover-item, .crypto-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      background: rgba(139, 92, 246, 0.05);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }

    .mover-item:hover, .crypto-item:hover {
      background: rgba(139, 92, 246, 0.1);
    }

    .mover-info, .crypto-info {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .mover-symbol, .crypto-symbol {
      font-weight: 600;
      color: var(--text-primary);
    }

    .mover-name, .crypto-name {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
    }

    .mover-price, .crypto-price {
      font-weight: 600;
      color: var(--text-primary);
      font-family: 'JetBrains Mono', monospace;
    }

    .mover-change, .crypto-change {
      font-weight: 600;
      font-size: var(--font-size-sm);
      min-width: 70px;
      text-align: right;
    }

    .mover-change.positive, .crypto-change.positive { color: var(--color-success); }
    .mover-change.negative, .crypto-change.negative { color: var(--color-error); }

    .crypto-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-lg);
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-size: var(--font-size-xl);
      font-weight: 700;
      color: var(--text-primary);
    }

    .stat-value.positive { color: var(--color-success); }
    .stat-value.negative { color: var(--color-error); }

    @media (max-width: 900px) {
      .analytics-grid {
        grid-template-columns: 1fr;
      }

      .analytics-card.large {
        grid-column: 1;
      }
    }
  `]
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  private stockService = inject(StockDataService);
  private financialService = inject(FinancialDataService);

  topStocks = signal<StockQuote[]>([]);
  cryptoData = signal<CryptoData[]>([]);
  isLiveData = signal(false);
  lastUpdate = signal<Date | null>(null);

  // Computed portfolio stats
  portfolioValue = signal(48294.50);
  dailyChange = signal(2.4);
  totalAssets = signal(12);
  profitLoss = signal(1245.00);

  private updateSubscription?: Subscription;

  ngOnInit(): void {
    this.loadData();
    this.startAutoUpdate();
    setTimeout(() => this.initCharts(), 100);
  }

  ngOnDestroy(): void {
    this.updateSubscription?.unsubscribe();
  }

  private loadData(): void {
    // Load stock data
    this.stockService.getTopStocks().subscribe({
      next: (data) => {
        // Sort by change percent and take top 5
        const sorted = [...data].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
        this.topStocks.set(sorted.slice(0, 5));
        this.isLiveData.set(this.stockService.isLiveData());
        this.lastUpdate.set(new Date());
        this.calculatePortfolioStats(data);
      }
    });

    // Load crypto data
    this.financialService.getCryptoMarketData(5).subscribe({
      next: (data) => {
        this.cryptoData.set(data);
      }
    });
  }

  private calculatePortfolioStats(stocks: StockQuote[]): void {
    // Calculate aggregate stats from stock data
    const totalValue = stocks.reduce((sum, s) => sum + s.price * 10, 0); // Simulated holdings
    const avgChange = stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length;

    this.portfolioValue.set(totalValue);
    this.dailyChange.set(avgChange);
    this.totalAssets.set(stocks.length + 5); // stocks + crypto
    this.profitLoss.set(totalValue * (avgChange / 100));
  }

  private startAutoUpdate(): void {
    this.updateSubscription = interval(60000).subscribe(() => {
      this.loadData();
    });
  }

  private initCharts(): void {
    this.initPortfolioChart();
    this.initPerformanceChart();
  }

  private initPortfolioChart(): void {
    const canvas = document.getElementById('portfolioChart') as HTMLCanvasElement;
    if (!canvas) return;

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Stocks', 'Crypto', 'Bonds', 'Cash'],
        datasets: [{
          data: [45, 30, 15, 10],
          backgroundColor: [
            'rgba(0, 212, 255, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(113, 113, 122, 0.8)'
          ],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#a1a1aa',
              padding: 20,
              font: { size: 12 }
            }
          }
        }
      }
    });
  }

  private initPerformanceChart(): void {
    const canvas = document.getElementById('performanceChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Portfolio Value',
          data: [35000, 38000, 36500, 42000, 44500, 43000, 46000, 48000, 45000, 47500, 49000, 48294],
          borderColor: '#00d4ff',
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: 'rgba(139, 92, 246, 0.1)' },
            ticks: { color: '#71717a' }
          },
          y: {
            grid: { color: 'rgba(139, 92, 246, 0.1)' },
            ticks: {
              color: '#71717a',
              callback: (value) => '$' + (Number(value) / 1000).toFixed(0) + 'k'
            }
          }
        }
      }
    });
  }
}
