import { Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';

export interface UserSettings {
    displayName: string;
    email: string;
    timezone: string;
    darkMode: boolean;
    realTimeUpdates: boolean;
    emailNotifications: boolean;
    alphaVantageApiKey: string;
    finnhubApiKey: string;
}

const DEFAULT_SETTINGS: UserSettings = {
    displayName: '',
    email: '',
    timezone: 'Europe/Madrid (GMT+1)',
    darkMode: true,
    realTimeUpdates: true,
    emailNotifications: false,
    alphaVantageApiKey: '',
    finnhubApiKey: ''
};

@Injectable({
    providedIn: 'root'
})
export class UserSettingsService {
    private readonly STORAGE_KEY = 'prisma_user_settings';

    settings = signal<UserSettings>(DEFAULT_SETTINGS);
    isLoading = signal(false);
    isSaved = signal(false);

    constructor(private authService: AuthService) {
        this.loadSettings();
    }

    /**
     * Load settings from localStorage and merge with user data
     */
    loadSettings(): void {
        // Load from localStorage
        const stored = localStorage.getItem(this.STORAGE_KEY);
        let localSettings: Partial<UserSettings> = {};

        if (stored) {
            try {
                localSettings = JSON.parse(stored);
            } catch (e) {
                console.warn('Failed to parse stored settings');
            }
        }

        // Merge with user data from auth
        const user = this.authService.currentUser;
        const mergedSettings: UserSettings = {
            ...DEFAULT_SETTINGS,
            ...localSettings,
            displayName: user?.user_metadata?.['display_name'] || localSettings.displayName || '',
            email: user?.email || localSettings.email || ''
        };

        this.settings.set(mergedSettings);
    }

    /**
     * Save settings to localStorage
     */
    saveSettings(newSettings: Partial<UserSettings>): void {
        this.isLoading.set(true);

        const updatedSettings = {
            ...this.settings(),
            ...newSettings
        };

        // Save to localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSettings));
        this.settings.set(updatedSettings);

        // Simulate save delay for UX
        setTimeout(() => {
            this.isLoading.set(false);
            this.isSaved.set(true);

            // Reset saved indicator after 2 seconds
            setTimeout(() => this.isSaved.set(false), 2000);
        }, 500);
    }

    /**
     * Update a single setting
     */
    updateSetting<K extends keyof UserSettings>(key: K, value: UserSettings[K]): void {
        this.saveSettings({ [key]: value });
    }

    /**
     * Clear all settings and reset to defaults
     */
    clearSettings(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        this.settings.set({
            ...DEFAULT_SETTINGS,
            email: this.authService.currentUser?.email || ''
        });
    }

    /**
     * Get the API key for FinnHub
     */
    getFinnhubApiKey(): string {
        return this.settings().finnhubApiKey || '';
    }

    /**
     * Get the API key for Alpha Vantage
     */
    getAlphaVantageApiKey(): string {
        return this.settings().alphaVantageApiKey || '';
    }
}
