import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private _apiUrl = 'https://jsonplaceholder.typicode.com';

    constructor(private http: HttpClient) {
    }

    get<Type>(endpoint: string, params?: HttpParams): Observable<Type> {
        return this.http.get<Type>(`${this._apiUrl}/${endpoint}`, {params});
    }

    post<Type>(endpoint: string, body: Type): Observable<Type> {
        return this.http.post<Type>(`${this._apiUrl}/${endpoint}`, body);
    }

    patch<Type, Body>(endpoint: string, id: number, body: Body): Observable<Type> {
        return this.http.patch<Type>(`${this._apiUrl}/${endpoint}/${id}`, body);
    }

    delete<Type>(endpoint: string, id: number): Observable<Type> {
        return this.http.delete<Type>(`${this._apiUrl}/${endpoint}/${id}`);
    }
}
