import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    async resetPassword(email: string) {
        return await this.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login`,
        });
    }
    private supabase: SupabaseClient;
    user = signal<User | null>(null);

    constructor(private router: Router) {
        this.supabase = createClient(environment.supabase.url, environment.supabase.key);

        // Initialize user
        this.supabase.auth.getUser().then(({ data }) => {
            this.user.set(data.user);
        });

        // Listen for auth changes
        this.supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                this.user.set(session?.user ?? null);
                this.router.navigate(['/dashboard']);
            } else if (event === 'SIGNED_OUT') {
                this.user.set(null);
                this.router.navigate(['/login']);
            }
        });
    }

    async signUp(email: string, password: string) {
        return await this.supabase.auth.signUp({
            email,
            password,
        });
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

    get currentUser() {
        return this.user();
    }
}
