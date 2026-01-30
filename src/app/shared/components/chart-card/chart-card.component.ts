import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chart-card glass-card">
      <div class="chart-header">
        <h3 class="chart-title">{{ title }}</h3>
        
        <div class="chart-controls" *ngIf="showControls">
          <select class="chart-select" [(ngModel)]="selectedPeriod" (change)="onPeriodChange()">
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
          
          <select class="chart-select" *ngIf="showTeamFilter">
            <option>Radio Team</option>
            <option>All Teams</option>
          </select>
        </div>
      </div>
      
      <div class="chart-container">
        <canvas #chartCanvas></canvas>
      </div>
    </div>
  `,
  styles: [`
    .chart-card {
      padding: var(--space-lg);
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
      flex-wrap: wrap;
      gap: var(--space-md);
    }

    .chart-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .chart-controls {
      display: flex;
      gap: var(--space-sm);
    }

    .chart-select {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      padding: var(--space-xs) var(--space-md);
      color: var(--text-secondary);
      font-size: var(--font-size-xs);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .chart-select:hover {
      border-color: var(--color-primary);
    }

    .chart-select:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.1);
    }

    .chart-container {
      flex: 1;
      min-height: 200px;
      position: relative;
    }

    .chart-container canvas {
      width: 100% !important;
      height: 100% !important;
    }
  `]
})
export class ChartCardComponent implements AfterViewInit, OnChanges {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() title: string = 'Chart';
  @Input() type: ChartType = 'line';
  @Input() data: any;
  @Input() options: any;
  @Input() showControls: boolean = true;
  @Input() showTeamFilter: boolean = false;

  selectedPeriod: string = 'month';
  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.chart) {
      this.updateChart();
    }
  }

  private createChart(): void {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const defaultOptions = this.getDefaultOptions();

    this.chart = new Chart(ctx, {
      type: this.type,
      data: this.data || { labels: [], datasets: [] },
      options: { ...defaultOptions, ...this.options }
    });
  }

  private updateChart(): void {
    if (!this.chart || !this.data) return;

    this.chart.data = this.data;
    this.chart.update('active');
  }

  private getDefaultOptions(): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(15, 10, 31, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#a1a1aa',
          borderColor: 'rgba(139, 92, 246, 0.3)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 4
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(139, 92, 246, 0.1)',
            drawBorder: false
          },
          ticks: {
            color: '#71717a',
            font: {
              size: 11
            }
          }
        },
        y: {
          grid: {
            color: 'rgba(139, 92, 246, 0.1)',
            drawBorder: false
          },
          ticks: {
            color: '#71717a',
            font: {
              size: 11
            }
          },
          beginAtZero: true
        }
      },
      elements: {
        line: {
          tension: 0.4,
          borderWidth: 2
        },
        point: {
          radius: 0,
          hoverRadius: 6,
          hoverBorderWidth: 2
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    };
  }

  onPeriodChange(): void {
    // Emit event or callback for period change
    console.log('Period changed to:', this.selectedPeriod);
  }
}
