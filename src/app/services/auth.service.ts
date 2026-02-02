import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private supabase: SupabaseClient;
    user = signal<User | null>(null);
    session = signal<Session | null>(null);
    isLoading = signal(true);
    isEmailVerified = signal(false);

    constructor(private router: Router) {
        this.supabase = createClient(environment.supabase.url, environment.supabase.key);
        this.initializeAuth();
    }

    private async initializeAuth(): Promise<void> {
        this.isLoading.set(true);

        // Get initial session
        const { data: { session }, error } = await this.supabase.auth.getSession();

        if (session) {
            this.session.set(session);
            this.user.set(session.user);
            this.isEmailVerified.set(session.user?.email_confirmed_at !== null);
        }

        this.isLoading.set(false);

        // Listen for auth changes
        this.supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth event:', event);

            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                this.session.set(session);
                this.user.set(session?.user ?? null);
                this.isEmailVerified.set(session?.user?.email_confirmed_at !== null);

                // Only navigate if not already on dashboard
                if (window.location.pathname !== '/dashboard') {
                    this.router.navigate(['/dashboard']);
                }
            } else if (event === 'SIGNED_OUT') {
                this.session.set(null);
                this.user.set(null);
                this.isEmailVerified.set(false);
                this.router.navigate(['/login']);
            } else if (event === 'USER_UPDATED') {
                this.user.set(session?.user ?? null);
                this.isEmailVerified.set(session?.user?.email_confirmed_at !== null);
            }
        });
    }

    /**
     * Wait for auth initialization to complete
     */
    async waitForInit(): Promise<boolean> {
        // If already loaded, return immediately
        if (!this.isLoading()) {
            return !!this.user();
        }

        // Wait for initialization
        return new Promise((resolve) => {
            const checkLoading = setInterval(() => {
                if (!this.isLoading()) {
                    clearInterval(checkLoading);
                    resolve(!!this.user());
                }
            }, 50);

            // Timeout after 5 seconds
            setTimeout(() => {
                clearInterval(checkLoading);
                resolve(false);
            }, 5000);
        });
    }

    async signUp(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/login`
            }
        });

        if (!error && data.user && !data.user.email_confirmed_at) {
            // Email confirmation is required
            return {
                data,
                error: null,
                needsEmailConfirmation: true
            };
        }

        return { data, error, needsEmailConfirmation: false };
    }

    async signIn(email: string, password: string) {
        return await this.supabase.auth.signInWithPassword({
            email,
            password,
        });
    }

    async signOut() {
        await this.supabase.auth.signOut();
    }

    async resetPassword(email: string) {
        return await this.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login`,
        });
    }

    async resendVerificationEmail(email: string) {
        return await this.supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: `${window.location.origin}/login`
            }
        });
    }

    async updatePassword(newPassword: string) {
        return await this.supabase.auth.updateUser({
            password: newPassword
        });
    }

    async updateProfile(data: { email?: string; data?: Record<string, any> }) {
        return await this.supabase.auth.updateUser(data);
    }

    get currentUser() {
        return this.user();
    }

    get currentSession() {
        return this.session();
    }

    get supabaseClient() {
        return this.supabase;
    }
}
