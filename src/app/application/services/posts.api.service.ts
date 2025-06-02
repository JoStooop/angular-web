import {inject, Injectable} from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiPostsAdapterService} from "../../infrastructure/adapters/api-posts-adapter.service";
import {AppPost} from "../../features/posts/application/common/models/post.interface";
import {AppNewPostForm} from "../../features/posts/application/common/models/post-form.interface";

@Injectable({
    providedIn: 'root'
})
export class PostsApiService {
    private _apiPostsAdapter = inject(ApiPostsAdapterService)

    getPosts(limit?: number): Observable<AppPost[]> {
        let params = new HttpParams();
        if (limit != null) params = params.set('_limit', limit);

        return this._apiPostsAdapter.get<AppPost[]>(params)
    }

    addPost(newPost: AppPost): Observable<AppPost> {
        return this._apiPostsAdapter.post<AppPost>(newPost)
    }

    updatePost(post: AppPost): Observable<AppPost> {
        return this._apiPostsAdapter.patch<AppPost, AppNewPostForm>(post.id, {
            title: post.title,
            body: post.body
        })
    }

    deletePost(id: number): Observable<void> {
        return this._apiPostsAdapter.delete<void>(id)
    }
}
