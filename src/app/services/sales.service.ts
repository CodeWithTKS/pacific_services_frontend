import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class salesService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    // Get all sales
    Getsales(filters?: { fromDate?: string; toDate?: string; portalId?: number }): Observable<any> {
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
            .get(environment.baseURL + `/sales`, { params })
            .pipe(catchError(this.handleError));
    }

    // Add a new sales
    Addsales(salesData: FormData): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/sales`, salesData)
            .pipe(catchError(this.handleError));
    }


    // Update a sales
    Updatesales(salesId: any, salesData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/sales/${salesId}`, salesData)
            .pipe(catchError(this.handleError));
    }

    // Delete a sales
    Deletesales(salesId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/sales/${salesId}`)
            .pipe(catchError(this.handleError));
    }
}
