import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="logo-icon">
             <img src="/assets/images/logo-prisma.png" alt="Prisma Logo" style="width: 100%; height: auto;">
        </div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        @for (item of navItems; track item.route) {
          <a 
            [routerLink]="item.route" 
            routerLinkActive="active"
            class="nav-item"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
            @if (item.badge) {
              <span class="nav-badge">{{ item.badge }}</span>
            }
          </a>
        }
      </nav>

      <!-- User Profile -->
      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=prisma" alt="User" />
          </div>
          <div class="user-info">
            <span class="user-name">User Profile</span>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      background: linear-gradient(180deg, 
        rgba(15, 10, 31, 0.95) 0%, 
        rgba(26, 20, 50, 0.98) 100%
      );
      border-right: 1px solid var(--border-primary);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(20px);
    }

    /* Logo */
    .sidebar-logo {
      padding: var(--space-xl);
      display: flex;
      align-items: center;
      gap: var(--space-md);
      border-bottom: 1px solid var(--border-primary);
    }

    .logo-icon {
      width: 192px; /* Double the original width */
      height: 96px;
    }

    .logo-icon svg {
      width: 100%;
      height: 100%;
    }

    .logo-text {
      font-size: var(--font-size-xl);
      font-weight: 600;
      background: linear-gradient(135deg, #00d4ff, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Navigation */
    .sidebar-nav {
      flex: 1;
      padding: var(--space-lg) var(--space-md);
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md) var(--space-lg);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      text-decoration: none;
      transition: all var(--transition-fast);
      position: relative;
    }

    .nav-item:hover {
      background: rgba(139, 92, 246, 0.1);
      color: var(--text-primary);
    }

    .nav-item.active {
      background: linear-gradient(135deg, 
        rgba(0, 212, 255, 0.15), 
        rgba(139, 92, 246, 0.15)
      );
      color: var(--color-primary);
      border: 1px solid rgba(0, 212, 255, 0.3);
    }

    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: var(--gradient-primary);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    }

    .nav-icon {
      font-size: var(--font-size-lg);
      width: 24px;
      text-align: center;
    }

    .nav-label {
      font-size: var(--font-size-sm);
      font-weight: 500;
    }

    .nav-badge {
      margin-left: auto;
      background: var(--color-error);
      color: white;
      font-size: 10px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: var(--radius-full);
      min-width: 18px;
      text-align: center;
    }

    /* User Profile */
    .sidebar-footer {
      padding: var(--space-lg);
      border-top: 1px solid var(--border-primary);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-sm);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .user-profile:hover {
      background: rgba(139, 92, 246, 0.1);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      overflow: hidden;
      border: 2px solid var(--border-primary);
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-name {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    /* Responsive */
    @media (max-width: 1280px) {
      .logo-text, .nav-label, .user-info {
        display: none;
      }
      
      .sidebar-logo {
        justify-content: center;
        padding: var(--space-lg);
      }
      
      .nav-item {
        justify-content: center;
        padding: var(--space-md);
      }

      .user-profile {
        justify-content: center;
      }
    }
  `]
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: '📊', route: '/dashboard' },
    { label: 'Analytics', icon: '📈', route: '/analytics' },
    { label: 'Reports', icon: '📋', route: '/reports' },
    { label: 'Settings', icon: '⚙️', route: '/settings' },
    { label: 'User Profile', icon: '👤', route: '/profile' }
  ];
}
