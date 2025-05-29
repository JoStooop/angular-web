import {inject, Injectable} from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiAdapterService} from "../../../../infrastructure/adapters/api-adapter.service";
import {AppNewPostForm} from "../common/models/post-form.interface";
import {AppPost} from "../common/models/post.interface";

@Injectable({
    providedIn: 'root'
})
export class PostsUseCaseService {
    apiAdapter = inject(ApiAdapterService)

    private _endpoint = 'posts'

    constructor() {
    }

    getPosts(limit?: number): Observable<AppPost[]> {
        let params = new HttpParams();
        if (limit != null) params = params.set('_limit', limit);

        return this.apiAdapter.get<AppPost[]>(this._endpoint, params)
    }

    addPost(newPost: AppPost): Observable<AppPost> {
        return this.apiAdapter.post<AppPost>(this._endpoint, newPost)
    }

    updatePost(post: AppPost): Observable<AppPost> {
        return this.apiAdapter.patch<AppPost, AppNewPostForm>(this._endpoint, post.id, {
            title: post.title,
            body: post.body
        })
    }

    deletePost(id: number): Observable<void> {
        return this.apiAdapter.delete<void>(this._endpoint, id)
    }
}
