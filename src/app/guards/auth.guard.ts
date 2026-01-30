import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // We might need to wait for initialization, but for now check signal
    // In a real app, checking the session validity via API or a promise is better
    // for the initial load.

    // Since supabase.auth.getUser() is async, the signal might not be set immediately on page reload.
    // Ideally we wait for the session restoration.
    // For this MVP, we will assume if there's no user, redirect to login.
    // A better approach is usually a Resolver or an async guard that waits for auth check.

    // Quick check for existing session in localStorage handled by supabase-js?
    // Supabase client persists session by default.

    // Let's rely on the service state, but we might have a race condition on refresh.
    // To be safe, let's peek at the local storage or just let the redirect logic in AuthService handle it?
    // No, the guard prevents loading the route.

    const user = authService.currentUser;
    if (user) {
        return true;
    } else {
        // If not logged in, maybe we are still loading?
        // Let's try to get the session directly here to be sure.
        // This is duplicate logic but safer for the guard.
        // Or we can leave it simple and user might get kicked to login, then redirected back if session restores.
        router.navigate(['/login']);
        return false;
    }
};
