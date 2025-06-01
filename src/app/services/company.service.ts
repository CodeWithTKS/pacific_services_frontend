import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class companyService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    // Get all company
    GetCompany(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/company`)
            .pipe(catchError(this.handleError));
    }

    // Add a new company
    AddCompany(companyData: any): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/company`, companyData)
            .pipe(catchError(this.handleError));
    }
}
