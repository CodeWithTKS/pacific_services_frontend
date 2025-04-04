import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class AepsService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    // Get all money transfers
    GetMoneyTransfers(filters?: { fromDate?: string; toDate?: string; portalId?: number }): Observable<any> {
        const params: any = {};

        // Add query parameters only if filters exist and have values
        if (filters?.fromDate) {
            params.fromDate = filters.fromDate;
        }
        if (filters?.toDate) {
            params.toDate = filters.toDate;
        }
        if (filters?.portalId) {
            params.portalId = filters.portalId;
        }

        return this.httpClient
            .get(environment.baseURL + `/aeps`, { params })
            .pipe(catchError(this.handleError));
    }

    getMoneyTransferStats(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/aeps/total/stats`)
            .pipe(catchError(this.handleError));
    }

    // Add a new money transfer
    AddMoneyTransfer(moneyTransferData: FormData): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/aeps`, moneyTransferData)
            .pipe(catchError(this.handleError));
    }

    // Update a money transfer
    UpdateMoneyTransfer(transferId: any, moneyTransferData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/aeps/${transferId}`, moneyTransferData)
            .pipe(catchError(this.handleError));
    }

    UpdateMoneyTransferNo(transferId: any, moneyTransferData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/aeps/transferNo/${transferId}`, moneyTransferData)
            .pipe(catchError(this.handleError));
    }

    // Delete a money transfer
    DeleteMoneyTransfer(transferId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/aeps/${transferId}`)
            .pipe(catchError(this.handleError));
    }
}
