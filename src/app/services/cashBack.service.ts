import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class cashBackService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    // Get all cashback
    Getcashback(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/cashback`)
            .pipe(catchError(this.handleError));
    }

    // Add a new cashback
    Addcashback(cashbackData: FormData): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/cashback`, cashbackData)
            .pipe(catchError(this.handleError));
    }


    // Update a cashback
    Updatecashback(cashbackId: any, cashbackData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/cashback/${cashbackId}`, cashbackData)
            .pipe(catchError(this.handleError));
    }

    // Delete a cashback
    Deletecashback(cashbackId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/cashback/${cashbackId}`)
            .pipe(catchError(this.handleError));
    }
}
