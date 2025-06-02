import {inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
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

        return this._apiPostsAdapter.get<AppPost[]>(params).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error)
                return throwError(() => new Error('Failed to fetch posts'))
            })
        )
    }

    addPost(newPost: AppPost): Observable<AppPost> {
        return this._apiPostsAdapter.post<AppPost>(newPost).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error)
                return throwError(() => new Error('Failed to send post'))
            })
        )
    }

    updatePost(post: AppPost): Observable<AppPost> {
        return this._apiPostsAdapter.patch<AppPost, AppNewPostForm>(post.id, {
            title: post.title,
            body: post.body
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error)
                return throwError(() => new Error('Failed to update post'))
            })
        )
    }

    deletePost(id: number): Observable<void> {
        return this._apiPostsAdapter.delete<void>(id).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error)
                return throwError(() => new Error('Failed to delete post'))
            })
        )
    }
}
