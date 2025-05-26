import {Injectable} from '@angular/core';
import {AppConfig} from "../../../../../environments/environment.dev";
import {Post} from "../../common/models/post.interface";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {ApiService} from "../../../../application/services/api.service";
import {EditPostForm} from "../../ui/common/models/post-form.interface";

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private _endpoint = 'posts'

    constructor(private api: ApiService) {
    }

    getPosts(limit?: number): Observable<Post[]> {
        let params = new HttpParams();
        if (limit != null) params = params.set('_limit', limit);

        return this.api.get<Post[]>(this._endpoint, params)
    }

    addPost(newPost: Post): Observable<Post> {
        return this.api.post<Post>(this._endpoint, newPost)
    }

    updatePost(post: Post): Observable<Post> {
        return this.api.patch<Post, EditPostForm>(this._endpoint, post.id, {
            title: post.title,
            body: post.body
        })
    }

    deletePost(id: number): Observable<void> {
        return this.api.delete<void>(this._endpoint, id)
    }
}
