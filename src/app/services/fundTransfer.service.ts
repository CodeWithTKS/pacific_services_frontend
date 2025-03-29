import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class fundTransferService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    // Get all fund transfers
    GetfundTransfers(filters?: { fromDate?: string; toDate?: string; portalId?: number; VendorID?: number }): Observable<any> {
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
        if (filters?.VendorID) {
            params.VendorID = filters.VendorID;
        }

        return this.httpClient
            .get(environment.baseURL + `/fundTransfer`, { params })
            .pipe(catchError(this.handleError));
    }

    // Add a new fund transfer
    AddfundTransfer(fundTransferData: FormData): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/fundTransfer`, fundTransferData)
            .pipe(catchError(this.handleError));
    }

    // Update a fund transfer
    UpdatefundTransfer(transferId: any, fundTransferData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/fundTransfer/${transferId}`, fundTransferData)
            .pipe(catchError(this.handleError));
    }

    UpdatefundTransferNo(transferId: any, fundTransferData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/fundTransfer/transferNo/${transferId}`, fundTransferData)
            .pipe(catchError(this.handleError));
    }

    // Delete a fund transfer
    DeletefundTransfer(transferId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/fundTransfer/${transferId}`)
            .pipe(catchError(this.handleError));
    }
}
