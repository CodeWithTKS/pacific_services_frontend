import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class portalService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    // Get all portals
    GetPortals(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/portal`)
            .pipe(catchError(this.handleError));
    }

    GethighlightEntry(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/portal/highlightEntry/all`)
            .pipe(catchError(this.handleError));
    }

    getPortalStats(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/portal/total/stats`)
            .pipe(catchError(this.handleError));
    }

    getPortalLogsById(id: any): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/portal/${id}/logs`)
            .pipe(catchError(this.handleError));
    }

    // Add a new portal
    AddPortal(portalData: FormData): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/portal`, portalData)
            .pipe(catchError(this.handleError));
    }

    // Add a portal logs
    addPortalLog(portalData: any): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/portal/create/logs`, portalData)
            .pipe(catchError(this.handleError));
    }

    // Update a portal
    UpdatePortal(portalId: any, portalData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/portal/${portalId}`, portalData)
            .pipe(catchError(this.handleError));
    }

    updateBalancePortal(portalId: any, portalData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/portal/updateBalancePortal/${portalId}`, portalData)
            .pipe(catchError(this.handleError));
    }

    // Delete a portal
    DeletePortal(portalId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/portal/${portalId}`)
            .pipe(catchError(this.handleError));
    }
}
