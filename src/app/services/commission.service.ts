import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class CommissionService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    // Get all commissions
    GetCommissions(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/commission`)
            .pipe(catchError(this.handleError));
    }

    // Add a new commission
    AddCommission(commissionData: FormData): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/commission`, commissionData)
            .pipe(catchError(this.handleError));
    }

    // Update a commission
    UpdateCommission(commissionId: any, commissionData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/commission/${commissionId}`, commissionData)
            .pipe(catchError(this.handleError));
    }

    // Delete a commission
    DeleteCommission(commissionId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/commission/${commissionId}`)
            .pipe(catchError(this.handleError));
    }
}
