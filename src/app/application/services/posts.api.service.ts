import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PostsApiService {
    private _apiUrl: string = 'https://jsonplaceholder.typicode.com';
    private _endpoint: string = 'posts';
    private _apiEndpoint: string = `${this._apiUrl}/${this._endpoint}`;

    constructor(private http: HttpClient) {
    }

    get<Type>(limit?: number): Observable<Type> {
        let params = new HttpParams();
        if (limit != null) params = params.set('_limit', limit);

        return this.http.get<Type>(this._apiEndpoint, {params});
    }

    post<Type>(body: Type): Observable<Type> {
        return this.http.post<Type>(this._apiEndpoint, body);
    }

    patch<Type>(id: number, body: Partial<Type>): Observable<Type> {
        return this.http.patch<Type>(`${this._apiEndpoint}/${id}`, body);
    }

    delete<Type>(id: number): Observable<Type> {
        return this.http.delete<Type>(`${this._apiEndpoint}/${id}`);
    }
}
