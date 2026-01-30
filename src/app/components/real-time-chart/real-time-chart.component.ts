import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import { WebSocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-real-time-chart',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="chart-container">
        <h2>Bitcoin Real-Time (BTC/USDT)</h2>
        <div #chart></div>
    </div>
  `,
    styles: [`
    .chart-container {
      background: #1e1e2d;
      padding: 20px;
      border-radius: 12px;
      color: white;
    }
    :host ::ng-deep text {
        fill: white;
    }
    :host ::ng-deep .domain, :host ::ng-deep .tick line {
        stroke: #444;
    }
  `]
})
export class RealTimeChartComponent implements OnInit, OnDestroy {
    @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

    private subscription!: Subscription;
    private data: any[] = [];
    private svg: any;
    private margin = { top: 20, right: 20, bottom: 30, left: 50 };
    private width = 0;
    private height = 0;
    private x: any;
    private y: any;
    private line: any;
    private g: any;

    constructor(private wsService: WebSocketService) { }

    ngOnInit() {
        this.initChart();
        this.wsService.connect();

        this.subscription = this.wsService.watch('/topic/market').subscribe((message) => {
            const parsed = JSON.parse(message.body);
            // Assuming payload has 'p' for price and 'E' for event time
            // We parse 'p' as float and 'E' as date
            if (parsed.p && parsed.E) {
                const point = {
                    price: parseFloat(parsed.p),
                    timestamp: new Date(parsed.E)
                };
                this.updateChart(point);
            }
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.wsService.deactivate();
    }

    private initChart() {
        const element = this.chartContainer.nativeElement;
        this.width = 600 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;

        this.svg = d3.select(element).append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);

        this.g = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        this.x = d3.scaleTime().rangeRound([0, this.width]);
        this.y = d3.scaleLinear().rangeRound([this.height, 0]);

        this.line = d3.line()
            .x((d: any) => this.x(d.timestamp))
            .y((d: any) => this.y(d.price));

        this.g.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0,${this.height})`);

        this.g.append('g')
            .attr('class', 'axis axis--y');

        this.g.append('path')
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', '#00bcd4')
            .attr('stroke-width', 2);
    }

    private updateChart(point: any) {
        this.data.push(point);
        // Keep only last 50 points
        if (this.data.length > 50) {
            this.data.shift();
        }

        this.x.domain(d3.extent(this.data, (d: any) => d.timestamp));
        this.y.domain([
            d3.min(this.data, (d: any) => d.price) * 0.999, // dynamic scale
            d3.max(this.data, (d: any) => d.price) * 1.001
        ]);

        this.g.select('.axis--x')
            .call(d3.axisBottom(this.x));

        this.g.select('.axis--y')
            .call(d3.axisLeft(this.y));

        this.g.select('.line')
            .datum(this.data)
            .attr('d', this.line);
    }
}
