import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { RealTimeChartComponent } from '../../components/real-time-chart/real-time-chart.component';
import { MockDataService } from '../../core/services/mock-data.service';
import { FinancialDataService } from '../../core/services/financial-data.service';
import { Transaction, CryptoData, GlobalActivityData } from '../../core/models/financial.models';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, HeaderComponent, MetricCardComponent, DecimalPipe, RealTimeChartComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
    // Charts
    private revenueChart: Chart | null = null;
    private acquisitionChart: Chart | null = null;

    // Data signals
    transactions = signal<Transaction[]>([]);
    cryptoData = signal<CryptoData[]>([]);
    globalActivity = signal<GlobalActivityData[]>([]);
    isLiveData = signal(false);

    // Intervals
    private updateInterval: any;

    constructor(
        private mockDataService: MockDataService,
        private financialDataService: FinancialDataService
    ) { }

    ngOnInit(): void {
        this.loadData();
        this.startRealTimeSimulation();
    }

    ngOnDestroy(): void {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.revenueChart) {
            this.revenueChart.destroy();
        }
        if (this.acquisitionChart) {
            this.acquisitionChart.destroy();
        }
    }

    private loadData(): void {
        // Load mock data
        this.transactions.set(this.mockDataService.generateTransactions());
        this.globalActivity.set(this.mockDataService.getGlobalActivityData());

        // Try to load live crypto data
        this.financialDataService.getCryptoMarketData(5).subscribe({
            next: (data) => {
                this.cryptoData.set(data);
                this.isLiveData.set(this.financialDataService.isLiveData());
            },
            error: () => {
                console.log('Using mock data');
            }
        });

        // Initialize charts after view is ready
        setTimeout(() => {
            this.initRevenueChart();
            this.initAcquisitionChart();
        }, 100);
    }

    private initRevenueChart(): void {
        const canvas = document.getElementById('revenueChart') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const data = this.mockDataService.getRevenueGrowthData();

        // Create gradients
        const gradientCyan = ctx.createLinearGradient(0, 0, 0, 300);
        gradientCyan.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
        gradientCyan.addColorStop(1, 'rgba(0, 212, 255, 0)');

        const gradientPurple = ctx.createLinearGradient(0, 0, 0, 300);
        gradientPurple.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
        gradientPurple.addColorStop(1, 'rgba(139, 92, 246, 0)');

        this.revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Revenue',
                        data: data.datasets[0].data,
                        borderColor: '#00d4ff',
                        backgroundColor: gradientCyan,
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#00d4ff',
                        pointHoverBorderColor: '#ffffff',
                        pointHoverBorderWidth: 2
                    },
                    {
                        label: 'Projected',
                        data: data.datasets[1].data,
                        borderColor: '#8b5cf6',
                        backgroundColor: gradientPurple,
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#8b5cf6',
                        pointHoverBorderColor: '#ffffff',
                        pointHoverBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 10, 31, 0.95)',
                        titleColor: '#ffffff',
                        bodyColor: '#a1a1aa',
                        borderColor: 'rgba(139, 92, 246, 0.3)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(139, 92, 246, 0.1)'
                        },
                        ticks: { color: '#71717a', font: { size: 11 } }
                    },
                    y: {
                        grid: {
                            color: 'rgba(139, 92, 246, 0.1)'
                        },
                        ticks: {
                            color: '#71717a',
                            font: { size: 11 },
                            callback: (value) => value.toLocaleString()
                        },
                        beginAtZero: true
                    }
                },
                interaction: { intersect: false, mode: 'index' }
            }
        });
    }

    private initAcquisitionChart(): void {
        const canvas = document.getElementById('acquisitionChart') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const data = this.mockDataService.getUserAcquisitionData();

        // Create gradient for bars
        const colors = data.labels.map((_, i) => {
            const ratio = i / (data.labels.length - 1);
            const r = Math.round(139 * (1 - ratio) + 0 * ratio);
            const g = Math.round(92 * (1 - ratio) + 212 * ratio);
            const b = Math.round(246 * (1 - ratio) + 255 * ratio);
            return `rgba(${r}, ${g}, ${b}, 0.8)`;
        });

        this.acquisitionChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'New Users',
                    data: data.datasets[0].data,
                    backgroundColor: colors,
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 10, 31, 0.95)',
                        titleColor: '#ffffff',
                        bodyColor: '#a1a1aa',
                        borderColor: 'rgba(139, 92, 246, 0.3)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#71717a', font: { size: 10 } }
                    },
                    y: {
                        grid: {
                            color: 'rgba(139, 92, 246, 0.1)'
                        },
                        ticks: { color: '#71717a', font: { size: 10 } },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    private startRealTimeSimulation(): void {
        // Simulate real-time updates every 5 seconds
        this.updateInterval = setInterval(() => {
            this.mockDataService.simulateRealTimeUpdate();

            // Add subtle chart animation
            if (this.revenueChart) {
                const datasets = this.revenueChart.data.datasets;
                datasets.forEach(dataset => {
                    dataset.data = dataset.data.map((val: any) =>
                        val + (Math.random() - 0.5) * 200
                    );
                });
                this.revenueChart.update('none');
            }
        }, 5000);
    }

    getStatusClass(status: string): string {
        const statusMap: Record<string, string> = {
            'completed': 'badge-success',
            'pending': 'badge-warning',
            'processing': 'badge-info',
            'failed': 'badge-error'
        };
        return statusMap[status] || 'badge-info';
    }

    getStatusLabel(status: string): string {
        const labelMap: Record<string, string> = {
            'completed': 'Explore',
            'pending': 'Restore',
            'processing': 'Processing',
            'failed': 'Failed'
        };
        return labelMap[status] || status;
    }

    getActivityColor(value: number): string {
        if (value < 0.2) return 'rgba(139, 92, 246, 0.1)';
        if (value < 0.4) return 'rgba(139, 92, 246, 0.3)';
        if (value < 0.6) return 'rgba(0, 212, 255, 0.4)';
        if (value < 0.8) return 'rgba(0, 212, 255, 0.6)';
        return 'rgba(0, 212, 255, 0.9)';
    }
}
