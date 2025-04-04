import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService,
        private snackBar: MatSnackBar
    ) { }

    canActivate(): boolean {
        const currentUser = this.authenticationService.currentUserValue;

        if (!currentUser || !currentUser.authdata) {
            this.router.navigate(['/auth/login']);
            return false;
        }

        const subscriptionExpiry = new Date(currentUser.user?.subscription_expiry);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (subscriptionExpiry <= today) {
            this.authenticationService.logout();
            this.snackBar.open(
                'Your subscription is over. Please renew to continue.',
                'Close',
                {
                    duration: 5000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                }
            );
            this.router.navigate(['/auth/login']);
            return false;
        }

        return true;
    }
}
