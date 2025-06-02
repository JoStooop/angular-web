import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiPostsAdapterService {
    private _apiUrl = 'https://jsonplaceholder.typicode.com';
    private _endpoint = 'posts';

    constructor(private http: HttpClient) {
    }

    get<Type>(params?: HttpParams): Observable<Type> {
        return this.http.get<Type>(`${this._apiUrl}/${this._endpoint}`, {params});
    }

    post<Type>(body: Type): Observable<Type> {
        return this.http.post<Type>(`${this._apiUrl}/${this._endpoint}`, body);
    }

    patch<Type, Body>(id: number, body: Body): Observable<Type> {
        return this.http.patch<Type>(`${this._apiUrl}/${this._endpoint}/${id}`, body);
    }

    delete<Type>( id: number): Observable<Type> {
        return this.http.delete<Type>(`${this._apiUrl}/${this._endpoint}/${id}`);
    }
}
