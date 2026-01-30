import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [CommonModule, HeaderComponent],
    template: `
    <app-header title="Analytics"></app-header>
    
    <div class="analytics-content">
      <div class="analytics-header">
        <h2>Market Analytics</h2>
        <p>Real-time market data and performance metrics</p>
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

        <!-- Market Movers -->
        <div class="analytics-card glass-card">
          <h3 class="card-title">Top Movers</h3>
          <div class="movers-list">
            @for (mover of topMovers; track mover.symbol) {
              <div class="mover-item">
                <div class="mover-info">
                  <span class="mover-symbol">{{ mover.symbol }}</span>
                  <span class="mover-name">{{ mover.name }}</span>
                </div>
                <div class="mover-change" [class.positive]="mover.change > 0" [class.negative]="mover.change < 0">
                  {{ mover.change > 0 ? '+' : '' }}{{ mover.change }}%
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
              <span class="stat-value">$48,294.50</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">24h Change</span>
              <span class="stat-value positive">+2.4%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total Assets</span>
              <span class="stat-value">12</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Profit/Loss</span>
              <span class="stat-value positive">+$1,245.00</span>
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
    .movers-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .mover-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md);
      background: rgba(139, 92, 246, 0.05);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }

    .mover-item:hover {
      background: rgba(139, 92, 246, 0.1);
    }

    .mover-info {
      display: flex;
      flex-direction: column;
    }

    .mover-symbol {
      font-weight: 600;
      color: var(--text-primary);
    }

    .mover-name {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
    }

    .mover-change {
      font-weight: 600;
      font-size: var(--font-size-sm);
    }

    .mover-change.positive { color: var(--color-success); }
    .mover-change.negative { color: var(--color-error); }

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
export class AnalyticsComponent implements OnInit {
    topMovers = [
        { symbol: 'BTC', name: 'Bitcoin', change: 5.24 },
        { symbol: 'ETH', name: 'Ethereum', change: 3.18 },
        { symbol: 'SOL', name: 'Solana', change: 8.92 },
        { symbol: 'ADA', name: 'Cardano', change: -1.45 },
        { symbol: 'DOT', name: 'Polkadot', change: 2.67 }
    ];

    ngOnInit(): void {
        setTimeout(() => {
            this.initCharts();
        }, 100);
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
                labels: ['Bitcoin', 'Ethereum', 'Solana', 'Others'],
                datasets: [{
                    data: [45, 25, 15, 15],
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
