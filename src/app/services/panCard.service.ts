import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class pancardService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    // Get all pancard
    Getpancard(filters?: { fromDate?: string; toDate?: string }): Observable<any> {
        const params: any = {};

        // Add query parameters only if filters exist and have values
        if (filters?.fromDate) {
            params.fromDate = filters.fromDate;
        }
        if (filters?.toDate) {
            params.toDate = filters.toDate;
        }
        return this.httpClient
            .get(environment.baseURL + `/pancard`, { params })
            .pipe(catchError(this.handleError));
    }

    // Add a new pancard
    Addpancard(pancardData: FormData): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/pancard`, pancardData)
            .pipe(catchError(this.handleError));
    }

    AddManualpancard(pancardData: FormData): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/pancard/manual/`, pancardData)
            .pipe(catchError(this.handleError));
    }

    // Update a pancard
    Updatepancard(pancardId: any, pancardData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/pancard/${pancardId}`, pancardData)
            .pipe(catchError(this.handleError));
    }

    // Delete a pancard
    Deletepancard(pancardId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/pancard/${pancardId}`)
            .pipe(catchError(this.handleError));
    }
}
