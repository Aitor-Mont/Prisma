import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';

interface Report {
    id: string;
    title: string;
    description: string;
    type: 'pdf' | 'excel' | 'csv';
    date: string;
    size: string;
    icon: string;
}

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule, HeaderComponent],
    template: `
    <app-header title="Reports"></app-header>
    
    <div class="reports-content">
      <div class="reports-header">
        <div>
          <h2>Financial Reports</h2>
          <p>Download and manage your automated financial reports</p>
        </div>
        <button class="btn btn-primary">
          <span>📄</span>
          Generate New Report
        </button>
      </div>

      <!-- Report Categories -->
      <div class="report-categories">
        @for (category of categories; track category.id) {
          <button 
            class="category-btn" 
            [class.active]="selectedCategory === category.id"
            (click)="selectedCategory = category.id"
          >
            <span class="category-icon">{{ category.icon }}</span>
            {{ category.name }}
          </button>
        }
      </div>

      <!-- Reports Grid -->
      <div class="reports-grid">
        @for (report of reports; track report.id) {
          <div class="report-card glass-card">
            <div class="report-icon">
              {{ report.icon }}
            </div>
            <div class="report-info">
              <h4 class="report-title">{{ report.title }}</h4>
              <p class="report-description">{{ report.description }}</p>
              <div class="report-meta">
                <span class="report-date">{{ report.date }}</span>
                <span class="report-size">{{ report.size }}</span>
              </div>
            </div>
            <div class="report-actions">
              <button class="btn btn-ghost" title="Preview">
                👁️
              </button>
              <button class="btn btn-ghost" title="Download">
                ⬇️
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Empty State -->
      @if (reports.length === 0) {
        <div class="empty-state glass-card">
          <span class="empty-icon">📊</span>
          <h3>No Reports Available</h3>
          <p>Generate your first report to see it here</p>
          <button class="btn btn-primary">Generate Report</button>
        </div>
      }
    </div>
  `,
    styles: [`
    .reports-content {
      padding: var(--space-xl);
    }

    .reports-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-xl);
    }

    .reports-header h2 {
      font-size: var(--font-size-3xl);
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-sm);
    }

    .reports-header p {
      color: var(--text-secondary);
    }

    /* Categories */
    .report-categories {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-xl);
      overflow-x: auto;
      padding-bottom: var(--space-sm);
    }

    .category-btn {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-lg);
      background: transparent;
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-full);
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      cursor: pointer;
      white-space: nowrap;
      transition: all var(--transition-fast);
    }

    .category-btn:hover {
      background: var(--bg-tertiary);
      border-color: var(--color-accent);
    }

    .category-btn.active {
      background: var(--gradient-primary);
      border-color: transparent;
      color: white;
    }

    .category-icon {
      font-size: 16px;
    }

    /* Reports Grid */
    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--space-lg);
    }

    .report-card {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      padding: var(--space-lg);
      transition: all var(--transition-base);
    }

    .report-card:hover {
      transform: translateY(-2px);
    }

    .report-icon {
      font-size: 32px;
      padding: var(--space-md);
      background: rgba(139, 92, 246, 0.1);
      border-radius: var(--radius-md);
    }

    .report-info {
      flex: 1;
    }

    .report-title {
      font-size: var(--font-size-base);
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-xs);
    }

    .report-description {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin-bottom: var(--space-sm);
    }

    .report-meta {
      display: flex;
      gap: var(--space-md);
      font-size: var(--font-size-xs);
      color: var(--text-muted);
    }

    .report-actions {
      display: flex;
      gap: var(--space-xs);
    }

    .report-actions .btn {
      width: 36px;
      height: 36px;
      padding: 0;
      font-size: 16px;
    }

    /* Empty State */
    .empty-state {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-2xl);
      text-align: center;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: var(--space-lg);
    }

    .empty-state h3 {
      font-size: var(--font-size-xl);
      color: var(--text-primary);
      margin-bottom: var(--space-sm);
    }

    .empty-state p {
      color: var(--text-secondary);
      margin-bottom: var(--space-lg);
    }

    @media (max-width: 768px) {
      .reports-header {
        flex-direction: column;
        gap: var(--space-lg);
      }

      .reports-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReportsComponent {
    selectedCategory = 'all';

    categories = [
        { id: 'all', name: 'All Reports', icon: '📁' },
        { id: 'financial', name: 'Financial', icon: '💰' },
        { id: 'performance', name: 'Performance', icon: '📈' },
        { id: 'audit', name: 'Audit', icon: '🔍' },
        { id: 'tax', name: 'Tax', icon: '📋' }
    ];

    reports: Report[] = [
        {
            id: '1',
            title: 'Q4 2024 Financial Summary',
            description: 'Complete financial overview for Q4 2024',
            type: 'pdf',
            date: 'Jan 15, 2025',
            size: '2.4 MB',
            icon: '📊'
        },
        {
            id: '2',
            title: 'Annual Performance Report',
            description: 'Year-end portfolio performance analysis',
            type: 'pdf',
            date: 'Jan 10, 2025',
            size: '5.1 MB',
            icon: '📈'
        },
        {
            id: '3',
            title: 'Transaction History Export',
            description: 'All transactions from 2024',
            type: 'excel',
            date: 'Jan 5, 2025',
            size: '1.8 MB',
            icon: '📑'
        },
        {
            id: '4',
            title: 'Tax Report 2024',
            description: 'Capital gains and losses summary',
            type: 'pdf',
            date: 'Jan 2, 2025',
            size: '890 KB',
            icon: '📋'
        },
        {
            id: '5',
            title: 'Monthly Statement - December',
            description: 'December 2024 account statement',
            type: 'pdf',
            date: 'Jan 1, 2025',
            size: '456 KB',
            icon: '📄'
        },
        {
            id: '6',
            title: 'Risk Assessment Report',
            description: 'Portfolio risk analysis and recommendations',
            type: 'pdf',
            date: 'Dec 28, 2024',
            size: '1.2 MB',
            icon: '⚠️'
        }
    ];
}
