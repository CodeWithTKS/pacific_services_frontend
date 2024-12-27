import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class MoneyTransferService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    // Get all money transfers
    GetMoneyTransfers(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/moneyTransfer`)
            .pipe(catchError(this.handleError));
    }

    // Add a new money transfer
    AddMoneyTransfer(moneyTransferData: FormData): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/moneyTransfer`, moneyTransferData)
            .pipe(catchError(this.handleError));
    }

    // Update a money transfer
    UpdateMoneyTransfer(transferId: any, moneyTransferData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/moneyTransfer/${transferId}`, moneyTransferData)
            .pipe(catchError(this.handleError));
    }

    // Delete a money transfer
    DeleteMoneyTransfer(transferId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/moneyTransfer/${transferId}`)
            .pipe(catchError(this.handleError));
    }
}
