import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

declare var Razorpay: any; // Ensure Razorpay SDK is declared

@Injectable({
    providedIn: 'root'
})
export class RazorpayService {
    private apiUrl = environment.baseURL; // API Base URL

    constructor(private http: HttpClient) { }

    // Call backend to create an order
    createOrder(role: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/subscription/create-order`, { role });
    }

    // Store Payment in Database
    storePayment(userId: number, transactionId: string, amount: number, role: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/subscription/store-payment`, { userId, transactionId, amount, role });
    }

    // Open Razorpay Payment UI
    openPayment(order: any, role: any, userId: number, onSuccess: (response: any) => void, onFailure: (error: any) => void): void {
        const options = {
            key: order.razorpayKey,
            amount: order.amount,
            currency: order.currency,
            name: 'TKS Freelance',
            description: 'Subscription Payment',
            order_id: order.id,
            handler: (response: any) => {
                // Store payment in the database after a successful transaction
                this.storePayment(userId, response.razorpay_payment_id, order.amount, role).subscribe({
                    next: () => {
                        console.log('Payment stored successfully');
                        onSuccess(response);
                    },
                    error: (error) => {
                        console.error('Error storing payment', error);
                        onFailure(error);
                    }
                });
            },
            prefill: {
                name: 'User Name', // Can be dynamic
                email: 'user@example.com' // Can be dynamic
            },
            theme: {
                color: '#004d99'
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();

        // Handle payment failure
        rzp.on('payment.failed', (response: any) => {
            onFailure(response);
        });
    }
}
