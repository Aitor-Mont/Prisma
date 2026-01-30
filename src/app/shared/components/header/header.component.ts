import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    template: `
    <header class="header">
      <div class="header-left">
        <h1 class="page-title">{{ title }}</h1>
      </div>
      
      <div class="header-right">
        <!-- Search (optional) -->
        <div class="header-search">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Search..." class="search-input" />
        </div>

        <!-- Notifications -->
        <button class="header-icon-btn" title="Messages">
          <span class="icon">✉️</span>
        </button>
        
        <button class="header-icon-btn has-notification" title="Notifications">
          <span class="icon">🔔</span>
          <span class="notification-dot"></span>
        </button>
        
        <!-- User Avatar -->
        <div class="header-avatar">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=prisma" alt="User" />
        </div>
      </div>
    </header>
  `,
    styles: [`
    .header {
      height: var(--header-height);
      background: rgba(15, 10, 31, 0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-primary);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-xl);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
    }

    .page-title {
      font-size: var(--font-size-2xl);
      font-weight: 600;
      color: var(--text-primary);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .header-search {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      background: var(--bg-tertiary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      padding: var(--space-sm) var(--space-md);
      transition: all var(--transition-fast);
    }

    .header-search:focus-within {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
    }

    .search-icon {
      font-size: var(--font-size-sm);
      opacity: 0.6;
    }

    .search-input {
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-size: var(--font-size-sm);
      width: 180px;
    }

    .search-input::placeholder {
      color: var(--text-muted);
    }

    .header-icon-btn {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: transparent;
      border: 1px solid transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-fast);
      position: relative;
    }

    .header-icon-btn:hover {
      background: var(--bg-tertiary);
      border-color: var(--border-primary);
    }

    .header-icon-btn .icon {
      font-size: 18px;
    }

    .header-icon-btn.has-notification .notification-dot {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background: var(--color-error);
      border-radius: 50%;
      border: 2px solid var(--bg-primary);
    }

    .header-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      overflow: hidden;
      border: 2px solid var(--border-primary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .header-avatar:hover {
      border-color: var(--color-primary);
      box-shadow: var(--shadow-glow-primary);
    }

    .header-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: 768px) {
      .header-search {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
    @Input() title: string = 'Dashboard';
}
