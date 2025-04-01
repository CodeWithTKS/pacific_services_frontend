import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) { }

    canActivate(): boolean {
        const currentUser = this.authenticationService.currentUserValue;
        
        if (!currentUser || !currentUser.authdata) {
            this.router.navigate(['/auth/login']);
            return false;
        }

        const subscriptionExpiry = new Date(currentUser.user?.subscription_expiry);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to compare only the date part

        if (subscriptionExpiry <= today) {
            this.authenticationService.logout();
            this.router.navigate(['/auth/login'], { queryParams: { message: 'Your subscription is over. Please renew to continue.' } });
            return false;
        }

        return true;
    }
}
