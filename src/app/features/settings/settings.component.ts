import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, HeaderComponent],
    template: `
    <app-header title="Settings"></app-header>
    
    <div class="settings-content">
      <div class="settings-grid">
        <!-- Profile Settings -->
        <div class="settings-section glass-card">
          <h3 class="section-title">Profile Settings</h3>
          
          <div class="setting-group">
            <label class="setting-label">Display Name</label>
            <input type="text" class="setting-input" value="John Doe" />
          </div>
          
          <div class="setting-group">
            <label class="setting-label">Email</label>
            <input type="email" class="setting-input" value="john.doe@example.com" />
          </div>
          
          <div class="setting-group">
            <label class="setting-label">Timezone</label>
            <select class="setting-input">
              <option>UTC (GMT+0)</option>
              <option selected>Europe/Madrid (GMT+1)</option>
              <option>America/New_York (GMT-5)</option>
            </select>
          </div>
        </div>

        <!-- Preferences -->
        <div class="settings-section glass-card">
          <h3 class="section-title">Preferences</h3>
          
          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-name">Dark Mode</span>
              <span class="setting-description">Enable dark theme</span>
            </div>
            <label class="toggle">
              <input type="checkbox" checked />
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-name">Real-time Updates</span>
              <span class="setting-description">Auto-refresh market data</span>
            </div>
            <label class="toggle">
              <input type="checkbox" checked />
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-name">Email Notifications</span>
              <span class="setting-description">Receive daily summary emails</span>
            </div>
            <label class="toggle">
              <input type="checkbox" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- API Configuration -->
        <div class="settings-section glass-card">
          <h3 class="section-title">API Configuration</h3>
          <p class="section-description">Configure external API keys for live market data</p>
          
          <div class="setting-group">
            <label class="setting-label">
              Alpha Vantage API Key
              <a href="https://www.alphavantage.co/support/#api-key" target="_blank" class="setting-link">Get free key →</a>
            </label>
            <input type="password" class="setting-input" placeholder="Enter your API key" />
          </div>
          
          <div class="setting-group">
            <label class="setting-label">
              Finnhub API Key
              <a href="https://finnhub.io/register" target="_blank" class="setting-link">Get free key →</a>
            </label>
            <input type="password" class="setting-input" placeholder="Enter your API key" />
          </div>
          
          <div class="api-status">
            <span class="status-dot connected"></span>
            <span>CoinGecko API: Connected (No key required)</span>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="settings-section glass-card danger">
          <h3 class="section-title">Danger Zone</h3>
          
          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-name">Clear Local Data</span>
              <span class="setting-description">Remove all cached data and preferences</span>
            </div>
            <button class="btn btn-danger">Clear Data</button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .settings-content {
      padding: var(--space-xl);
      max-width: 800px;
    }

    .settings-grid {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .settings-section {
      padding: var(--space-xl);
    }

    .settings-section.danger {
      border-color: rgba(239, 68, 68, 0.3);
    }

    .section-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-lg);
    }

    .section-description {
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      margin-top: calc(var(--space-lg) * -1);
      margin-bottom: var(--space-lg);
    }

    .setting-group {
      margin-bottom: var(--space-lg);
    }

    .setting-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin-bottom: var(--space-sm);
    }

    .setting-link {
      font-size: var(--font-size-xs);
      color: var(--color-primary);
    }

    .setting-input {
      width: 100%;
      padding: var(--space-md);
      background: var(--bg-tertiary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-size: var(--font-size-sm);
    }

    .setting-input:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
    }

    .setting-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md) 0;
      border-bottom: 1px solid var(--border-primary);
    }

    .setting-row:last-child {
      border-bottom: none;
    }

    .setting-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .setting-name {
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--text-primary);
    }

    .setting-description {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
    }

    /* Toggle Switch */
    .toggle {
      position: relative;
      width: 48px;
      height: 26px;
      cursor: pointer;
    }

    .toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-full);
      transition: all var(--transition-fast);
    }

    .toggle-slider::before {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      left: 2px;
      bottom: 2px;
      background: var(--text-muted);
      border-radius: 50%;
      transition: all var(--transition-fast);
    }

    .toggle input:checked + .toggle-slider {
      background: var(--gradient-primary);
      border-color: transparent;
    }

    .toggle input:checked + .toggle-slider::before {
      transform: translateX(22px);
      background: white;
    }

    /* API Status */
    .api-status {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-md);
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      color: var(--color-success);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-success);
    }

    .status-dot.connected {
      animation: pulse 1.5s infinite;
    }

    /* Danger Button */
    .btn-danger {
      background: transparent;
      border: 1px solid var(--color-error);
      color: var(--color-error);
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .btn-danger:hover {
      background: rgba(239, 68, 68, 0.1);
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class SettingsComponent { }
