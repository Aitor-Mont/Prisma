import { Injectable, signal, computed } from '@angular/core';
import {
    CryptoData,
    ChartDataPoint,
    Transaction,
    KPIMetric,
    GlobalActivityData,
    TimeSeriesData
} from '../models/financial.models';

@Injectable({
    providedIn: 'root'
})
export class MockDataService {

    // Signals for reactive data
    private _cryptoData = signal<CryptoData[]>([]);
    private _transactions = signal<Transaction[]>([]);
    private _kpiMetrics = signal<KPIMetric[]>([]);

    // Public computed values
    readonly cryptoData = computed(() => this._cryptoData());
    readonly transactions = computed(() => this._transactions());
    readonly kpiMetrics = computed(() => this._kpiMetrics());

    constructor() {
        this.initializeMockData();
    }

    private initializeMockData(): void {
        this._kpiMetrics.set(this.generateKPIMetrics());
        this._transactions.set(this.generateTransactions());
    }

    // Generate KPI metrics
    generateKPIMetrics(): KPIMetric[] {
        return [
            {
                id: 'total-sales',
                title: 'Total Sales',
                value: '$1,225.00',
                change: 3.3,
                changeType: 'increase',
                icon: 'trending_up',
                color: 'cyan'
            },
            {
                id: 'new-customers',
                title: 'New Customers',
                value: 446,
                change: 3.5,
                changeType: 'increase',
                icon: 'people',
                color: 'purple'
            },
            {
                id: 'active-sessions',
                title: 'Active Sessions',
                value: 1297,
                change: 3.8,
                changeType: 'increase',
                icon: 'analytics',
                color: 'green'
            }
        ];
    }

    // Generate revenue growth data for area chart
    getRevenueGrowthData(): TimeSeriesData {
        const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

        // Generate two series with some correlation
        const baseValues = this.generateSmoothData(9, 2000, 10000);
        const secondSeries = baseValues.map((v, i) =>
            v * (0.6 + Math.random() * 0.3) + (Math.random() - 0.5) * 1000
        );

        return {
            labels: months,
            datasets: [
                {
                    label: 'Revenue',
                    data: baseValues,
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    fill: true
                },
                {
                    label: 'Projected',
                    data: secondSeries,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    fill: true
                }
            ]
        };
    }

    // Generate user acquisition data for bar chart
    getUserAcquisitionData(): TimeSeriesData {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
        const values = months.map(() => Math.floor(50 + Math.random() * 250));

        return {
            labels: months,
            datasets: [
                {
                    label: 'New Users',
                    data: values,
                    backgroundColor: this.generateGradientColors(values.length),
                }
            ]
        };
    }

    // Generate global activity heatmap data
    getGlobalActivityData(): GlobalActivityData[] {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data: GlobalActivityData[] = [];

        days.forEach(day => {
            for (let hour = 0; hour < 7; hour++) {
                data.push({
                    day,
                    hour,
                    value: Math.random()
                });
            }
        });

        return data;
    }

    // Generate transactions
    generateTransactions(): Transaction[] {
        const names = [
            'Doxertodonats', 'Email Servings', 'Initial Manager',
            'Email Shopping', 'Donsr todomarks', 'Cloud Services',
            'Marketing Pro', 'Data Analytics', 'Security Suite'
        ];

        const statuses: Transaction['status'][] = ['completed', 'pending', 'processing', 'failed'];
        const types: Transaction['type'][] = ['income', 'expense', 'transfer'];

        return names.slice(0, 5).map((name, i) => ({
            id: `tx-${i + 1}`,
            name,
            type: types[Math.floor(Math.random() * types.length)],
            status: i < 2 ? 'completed' : (i === 2 ? 'pending' : 'completed'),
            amount: Math.floor(80 + Math.random() * 200),
            date: this.generateRecentDate(i * 2),
            category: 'Business'
        }));
    }

    // Simulate real-time updates
    simulateRealTimeUpdate(): KPIMetric[] {
        const currentMetrics = this._kpiMetrics();

        const updatedMetrics = currentMetrics.map(metric => {
            const changeAmount = (Math.random() - 0.5) * 0.5;
            let newValue = metric.value;

            if (typeof metric.value === 'string' && metric.value.startsWith('$')) {
                const numValue = parseFloat(metric.value.replace(/[$,]/g, ''));
                const updated = numValue + (numValue * changeAmount * 0.01);
                newValue = `$${updated.toFixed(2)}`;
            } else if (typeof metric.value === 'number') {
                newValue = Math.floor(metric.value * (1 + changeAmount * 0.01));
            }

            return {
                ...metric,
                value: newValue,
                change: Math.round((metric.change + changeAmount) * 10) / 10
            };
        });

        this._kpiMetrics.set(updatedMetrics);
        return updatedMetrics;
    }

    // Helper: Generate smooth random data
    private generateSmoothData(count: number, min: number, max: number): number[] {
        const data: number[] = [];
        let current = min + Math.random() * (max - min) * 0.5;

        for (let i = 0; i < count; i++) {
            const change = (Math.random() - 0.4) * (max - min) * 0.2;
            current = Math.max(min, Math.min(max, current + change));
            data.push(Math.round(current));
        }

        return data;
    }

    // Helper: Generate gradient colors for bar chart
    private generateGradientColors(count: number): string[] {
        const colors: string[] = [];
        for (let i = 0; i < count; i++) {
            const ratio = i / (count - 1);
            const r = Math.round(139 * (1 - ratio) + 0 * ratio);
            const g = Math.round(92 * (1 - ratio) + 212 * ratio);
            const b = Math.round(246 * (1 - ratio) + 255 * ratio);
            colors.push(`rgba(${r}, ${g}, ${b}, 0.8)`);
        }
        return colors;
    }

    // Helper: Generate recent dates
    private generateRecentDate(daysAgo: number): string {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString().split('T')[0];
    }
}
