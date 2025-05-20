import {Injectable} from '@angular/core';
import {AppConfig} from "../../../../../environments/environment.dev";
import {Post} from "../../common/models/post.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, tap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    _apiUrl: string = 'https://jsonplaceholder.typicode.com'

    // private controllerUrl: string = AppConfig.postsEndpoint;

    constructor(private http: HttpClient) {
    }

    // прочитал в доке Ангуляра про HttpParams
    // пробовал через isNull, но не сработало
    // Тут надо будет подумать как еще добавлять другие параметры
    loadPosts(limit?: number): Observable<Post[]> {
        let params = new HttpParams();

        if (limit != null) {
            params = params.set('_limit', limit);
        }

        return this.http.get<Post[]>(`${this._apiUrl}/posts`, {params})
    }

    addPost(newPost: Post): Observable<Post> {
        return this.http.post<Post>(`${this._apiUrl}/posts`, newPost);
    }

    updatePost(post: Post): Observable<Post> {
        return this.http.patch<Post>(`${this._apiUrl}/posts/${post.id}`, {
            title: post.title,
            body: post.body
        });
    }

    deletePost(id: number): Observable<void> {
        return this.http.delete<void>(`${this._apiUrl}/posts/${id}`)
    }
}
