import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-metric-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="metric-card" [class]="'color-' + color">
      <div class="metric-header">
        <span class="metric-icon">{{ icon }}</span>
      </div>
      
      <div class="metric-content">
        <span class="metric-title">{{ title }}</span>
        <div class="metric-value-row">
          <span class="metric-value">{{ value }}</span>
          <span 
            class="metric-change" 
            [class.positive]="change > 0" 
            [class.negative]="change < 0"
          >
            <span class="change-icon">{{ change > 0 ? '▲' : '▼' }}</span>
            {{ change | number:'1.1-1' }}%
          </span>
        </div>
      </div>

      <!-- Decorative glow -->
      <div class="card-glow"></div>
    </div>
  `,
    styles: [`
    .metric-card {
      background: var(--gradient-card);
      backdrop-filter: blur(16px);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      position: relative;
      overflow: hidden;
      transition: all var(--transition-base);
    }

    .metric-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, 
        transparent, 
        var(--card-accent, var(--color-primary)), 
        transparent
      );
      opacity: 0.5;
    }

    .metric-card:hover {
      transform: translateY(-2px);
      border-color: var(--card-accent, var(--color-primary));
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }

    /* Color variants */
    .metric-card.color-cyan {
      --card-accent: var(--color-primary);
    }

    .metric-card.color-purple {
      --card-accent: var(--color-accent);
    }

    .metric-card.color-green {
      --card-accent: var(--color-success);
    }

    .metric-card.color-pink {
      --card-accent: #ec4899;
    }

    .metric-header {
      margin-bottom: var(--space-md);
    }

    .metric-icon {
      font-size: 24px;
      display: inline-block;
      padding: var(--space-sm);
      background: rgba(255, 255, 255, 0.05);
      border-radius: var(--radius-md);
    }

    .metric-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .metric-title {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      font-weight: 500;
    }

    .metric-value-row {
      display: flex;
      align-items: baseline;
      gap: var(--space-md);
    }

    .metric-value {
      font-size: var(--font-size-3xl);
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
    }

    .metric-change {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: var(--font-size-sm);
      font-weight: 600;
      padding: 2px 8px;
      border-radius: var(--radius-full);
    }

    .metric-change.positive {
      color: var(--color-success);
      background: rgba(16, 185, 129, 0.15);
    }

    .metric-change.negative {
      color: var(--color-error);
      background: rgba(239, 68, 68, 0.15);
    }

    .change-icon {
      font-size: 10px;
    }

    /* Decorative glow */
    .card-glow {
      position: absolute;
      bottom: -50%;
      right: -20%;
      width: 150px;
      height: 150px;
      background: radial-gradient(circle, var(--card-accent, var(--color-primary)) 0%, transparent 70%);
      opacity: 0.1;
      pointer-events: none;
    }
  `]
})
export class MetricCardComponent {
    @Input() title: string = 'Metric';
    @Input() value: string | number = 0;
    @Input() change: number = 0;
    @Input() icon: string = '📊';
    @Input() color: 'cyan' | 'purple' | 'green' | 'pink' = 'cyan';
}
