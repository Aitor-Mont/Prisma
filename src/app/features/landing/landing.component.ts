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

    isLogin = signal(true); // Toggle between Login and Register
    isLoading = signal(false);
    errorMessage = signal('');
    successMessage = signal('');
    showForgotPassword = signal(false);
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

    async onForgotPassword() {
        this.emailError.set('');
        this.errorMessage.set('');
        this.successMessage.set('');

        // Validate email format
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
            
            // Return to login form after 3 seconds
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

        try {
            if (this.isLogin()) {
                const { error } = await this.authService.signIn(this.email, this.password);
                if (error) throw error;
                // Router navigation is handled in AuthService subscription, but we can do it here too for safety
            } else {
                const { error } = await this.authService.signUp(this.email, this.password);
                if (error) throw error;
                alert('Registration successful! Please check your email for confirmation link (if enabled) or log in.');
                this.toggleMode(); // Switch to login
            }
        } catch (err: any) {
            this.errorMessage.set(err.message || 'An unexpected error occurred');
        } finally {
            this.isLoading.set(false);
        }
    }
}
