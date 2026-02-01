import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { UserSettingsService, UserSettings } from '../../services/user-settings.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
  template: `
    <app-header title="Settings"></app-header>
    
    <div class="settings-content">
      <!-- Save Indicator -->
      <div class="save-indicator" *ngIf="settingsService.isSaved()">
        <span class="save-icon">✓</span> Settings saved
      </div>

      <div class="settings-grid">
        <!-- Profile Settings -->
        <div class="settings-section glass-card">
          <h3 class="section-title">Profile Settings</h3>
          
          <div class="setting-group">
            <label class="setting-label">Display Name</label>
            <input type="text" class="setting-input" 
                   [(ngModel)]="displayName" 
                   (blur)="saveField('displayName', displayName)"
                   placeholder="Enter your name" />
          </div>
          
          <div class="setting-group">
            <label class="setting-label">Email</label>
            <input type="email" class="setting-input" 
                   [value]="settings().email" 
                   readonly
                   title="Email cannot be changed here" />
            <span class="setting-hint">Email is managed through your account</span>
          </div>
          
          <div class="setting-group">
            <label class="setting-label">Timezone</label>
            <select class="setting-input" 
                    [(ngModel)]="timezone"
                    (change)="saveField('timezone', timezone)">
              <option>UTC (GMT+0)</option>
              <option>Europe/Madrid (GMT+1)</option>
              <option>Europe/London (GMT+0)</option>
              <option>America/New_York (GMT-5)</option>
              <option>America/Los_Angeles (GMT-8)</option>
              <option>Asia/Tokyo (GMT+9)</option>
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
              <input type="checkbox" 
                     [(ngModel)]="darkMode"
                     (change)="saveField('darkMode', darkMode)" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-name">Real-time Updates</span>
              <span class="setting-description">Auto-refresh market data</span>
            </div>
            <label class="toggle">
              <input type="checkbox" 
                     [(ngModel)]="realTimeUpdates"
                     (change)="saveField('realTimeUpdates', realTimeUpdates)" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-name">Email Notifications</span>
              <span class="setting-description">Receive daily summary emails</span>
            </div>
            <label class="toggle">
              <input type="checkbox" 
                     [(ngModel)]="emailNotifications"
                     (change)="saveField('emailNotifications', emailNotifications)" />
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
            <input type="password" class="setting-input" 
                   [(ngModel)]="alphaVantageApiKey"
                   (blur)="saveField('alphaVantageApiKey', alphaVantageApiKey)"
                   placeholder="Enter your API key" />
          </div>
          
          <div class="setting-group">
            <label class="setting-label">
              Finnhub API Key
              <a href="https://finnhub.io/register" target="_blank" class="setting-link">Get free key →</a>
            </label>
            <input type="password" class="setting-input" 
                   [(ngModel)]="finnhubApiKey"
                   (blur)="saveField('finnhubApiKey', finnhubApiKey)"
                   placeholder="Enter your API key" />
          </div>
          
          <div class="api-status">
            <span class="status-dot connected"></span>
            <span>CoinGecko API: Connected (No key required)</span>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="settings-section glass-card">
          <h3 class="section-title">Account</h3>
          
          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-name">Sign Out</span>
              <span class="setting-description">Sign out of your account</span>
            </div>
            <button class="btn btn-secondary" (click)="signOut()">Sign Out</button>
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
            <button class="btn btn-danger" (click)="clearData()">Clear Data</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-content {
      padding: var(--space-xl);
      max-width: 800px;
      position: relative;
    }

    .save-indicator {
      position: fixed;
      top: 80px;
      right: 24px;
      background: rgba(16, 185, 129, 0.9);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      animation: slideIn 0.3s ease;
      z-index: 100;
    }

    @keyframes slideIn {
      from { transform: translateX(100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .save-icon {
      font-size: 16px;
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

    .setting-hint {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
      margin-top: var(--space-xs);
      display: block;
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

    .setting-input[readonly] {
      opacity: 0.7;
      cursor: not-allowed;
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

    /* Buttons */
    .btn {
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .btn-secondary {
      background: transparent;
      border: 1px solid var(--border-primary);
      color: var(--text-secondary);
    }

    .btn-secondary:hover {
      background: var(--bg-tertiary);
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    .btn-danger {
      background: transparent;
      border: 1px solid var(--color-error);
      color: var(--color-error);
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
export class SettingsComponent implements OnInit {
  settingsService = inject(UserSettingsService);
  authService = inject(AuthService);

  settings = this.settingsService.settings;

  // Form fields
  displayName = '';
  timezone = '';
  darkMode = true;
  realTimeUpdates = true;
  emailNotifications = false;
  alphaVantageApiKey = '';
  finnhubApiKey = '';

  ngOnInit(): void {
    this.loadFormValues();
  }

  private loadFormValues(): void {
    const s = this.settings();
    this.displayName = s.displayName;
    this.timezone = s.timezone;
    this.darkMode = s.darkMode;
    this.realTimeUpdates = s.realTimeUpdates;
    this.emailNotifications = s.emailNotifications;
    this.alphaVantageApiKey = s.alphaVantageApiKey;
    this.finnhubApiKey = s.finnhubApiKey;
  }

  saveField<K extends keyof UserSettings>(key: K, value: UserSettings[K]): void {
    this.settingsService.updateSetting(key, value);
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
  }

  clearData(): void {
    if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      this.settingsService.clearSettings();
      this.loadFormValues();
    }
  }
}
