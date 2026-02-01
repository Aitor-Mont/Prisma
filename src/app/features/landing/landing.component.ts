import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.css'
})
export class LandingComponent {
    authService = inject(AuthService);
    router = inject(Router);

    isLogin = signal(true);
    isLoading = signal(false);
    errorMessage = signal('');
    successMessage = signal('');
    showForgotPassword = signal(false);
    showVerificationPending = signal(false);
    pendingEmail = signal('');
    emailError = signal('');

    email = '';
    password = '';
    forgotEmail = '';

    toggleMode() {
        this.isLogin.set(!this.isLogin());
        this.errorMessage.set('');
        this.successMessage.set('');
    }

    validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showForgotPasswordForm() {
        this.showForgotPassword.set(true);
        this.errorMessage.set('');
        this.successMessage.set('');
        this.emailError.set('');
    }

    cancelForgotPassword() {
        this.showForgotPassword.set(false);
        this.forgotEmail = '';
        this.errorMessage.set('');
        this.successMessage.set('');
        this.emailError.set('');
    }

    backToLogin() {
        this.showVerificationPending.set(false);
        this.pendingEmail.set('');
        this.isLogin.set(true);
        this.errorMessage.set('');
        this.successMessage.set('');
    }

    async resendVerificationEmail() {
        if (!this.pendingEmail()) {
            this.errorMessage.set('No email address to resend to');
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set('');
        this.successMessage.set('');

        try {
            const { error } = await this.authService.resendVerificationEmail(this.pendingEmail());
            if (error) throw error;

            this.successMessage.set('Verification email sent! Please check your inbox.');
        } catch (err: any) {
            this.errorMessage.set(err.message || 'Failed to resend verification email');
        } finally {
            this.isLoading.set(false);
        }
    }

    async onForgotPassword() {
        this.emailError.set('');
        this.errorMessage.set('');
        this.successMessage.set('');

        if (!this.forgotEmail) {
            this.emailError.set('Email is required');
            return;
        }

        if (!this.validateEmail(this.forgotEmail)) {
            this.emailError.set('Please enter a valid email address');
            return;
        }

        this.isLoading.set(true);

        try {
            const { error } = await this.authService.resetPassword(this.forgotEmail);
            if (error) throw error;

            this.successMessage.set('Password reset email sent! Please check your inbox.');
            this.forgotEmail = '';

            setTimeout(() => {
                this.cancelForgotPassword();
            }, 3000);
        } catch (err: any) {
            this.errorMessage.set(err.message || 'Failed to send reset email');
        } finally {
            this.isLoading.set(false);
        }
    }

    async onSubmit() {
        this.isLoading.set(true);
        this.errorMessage.set('');
        this.successMessage.set('');

        // Basic validation
        if (!this.email || !this.password) {
            this.errorMessage.set('Please fill in all fields');
            this.isLoading.set(false);
            return;
        }

        if (!this.validateEmail(this.email)) {
            this.errorMessage.set('Please enter a valid email address');
            this.isLoading.set(false);
            return;
        }

        if (!this.isLogin() && this.password.length < 6) {
            this.errorMessage.set('Password must be at least 6 characters');
            this.isLoading.set(false);
            return;
        }

        try {
            if (this.isLogin()) {
                const { error } = await this.authService.signIn(this.email, this.password);
                if (error) throw error;
                // Navigation is handled by AuthService
            } else {
                const result = await this.authService.signUp(this.email, this.password);
                if (result.error) throw result.error;

                if (result.needsEmailConfirmation) {
                    // Show verification pending state
                    this.pendingEmail.set(this.email);
                    this.showVerificationPending.set(true);
                    this.email = '';
                    this.password = '';
                } else {
                    // Auto-confirmed or auto-login
                    this.successMessage.set('Registration successful! You are now logged in.');
                }
            }
        } catch (err: any) {
            console.error('Auth error:', err);
            // Provide user-friendly error messages
            let message = err.message || 'An unexpected error occurred';

            if (message.includes('Invalid login credentials')) {
                message = 'Invalid email or password. Please try again.';
            } else if (message.includes('Email not confirmed')) {
                message = 'Please verify your email before signing in.';
            } else if (message.includes('User already registered')) {
                message = 'An account with this email already exists. Try signing in instead.';
            }

            this.errorMessage.set(message);
        } finally {
            this.isLoading.set(false);
        }
    }
}
