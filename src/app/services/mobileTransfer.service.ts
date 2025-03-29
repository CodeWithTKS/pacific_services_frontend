import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class MobileTransferService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    // Get all mobile transfers
    GetmobileTransfers(filters?: { fromDate?: string; toDate?: string; portalId?: number; VendorID?: number }): Observable<any> {
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
            .get(environment.baseURL + `/mobileTransfer`, { params })
            .pipe(catchError(this.handleError));
    }

    // Add a new mobile transfer
    AddmobileTransfer(mobileTransferData: FormData): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/mobileTransfer`, mobileTransferData)
            .pipe(catchError(this.handleError));
    }

    // Update a mobile transfer
    UpdatemobileTransfer(transferId: any, mobileTransferData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/mobileTransfer/${transferId}`, mobileTransferData)
            .pipe(catchError(this.handleError));
    }

    UpdatemobileTransferNo(transferId: any, mobileTransferData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/mobileTransfer/transferNo/${transferId}`, mobileTransferData)
            .pipe(catchError(this.handleError));
    }

    // Delete a mobile transfer
    DeletemobileTransfer(transferId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/mobileTransfer/${transferId}`)
            .pipe(catchError(this.handleError));
    }
}
