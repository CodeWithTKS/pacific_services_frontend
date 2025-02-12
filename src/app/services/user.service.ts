import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class userService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    // Get all user
    Getuser(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/user`)
            .pipe(catchError(this.handleError));
    }

    // Add a new user
    Adduser(userData: FormData): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/user`, userData)
            .pipe(catchError(this.handleError));
    }


    // Update a user
    Updateuser(userId: any, userData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/user/${userId}`, userData)
            .pipe(catchError(this.handleError));
    }

    // Delete a user
    Deleteuser(userId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/user/${userId}`)
            .pipe(catchError(this.handleError));
    }
}
