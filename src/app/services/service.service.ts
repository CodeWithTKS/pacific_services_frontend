import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class serviceService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    // Get all services
    Getservices(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/services`)
            .pipe(catchError(this.handleError));
    }

    // Add a new services
    Addservices(servicesData: FormData): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/services`, servicesData)
            .pipe(catchError(this.handleError));
    }


    // Update a services
    Updateservices(servicesId: any, servicesData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/services/${servicesId}`, servicesData)
            .pipe(catchError(this.handleError));
    }

    // Delete a services
    Deleteservices(servicesId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/services/${servicesId}`)
            .pipe(catchError(this.handleError));
    }
}
