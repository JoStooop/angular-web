import {inject, Injectable} from '@angular/core';
import {catchError, Observable, of} from "rxjs";
import {AppPost} from "../common/models/post.interface";
import {PostsApiService} from "../../../../application/services/posts.api.service";

@Injectable({
    providedIn: 'root'
})
export class PostsUseCaseService {
    private _postsApi = inject(PostsApiService)

    getPosts(limit?: number): Observable<AppPost[]> {
        return this._postsApi.getPosts(limit).pipe(
          catchError(() => of([]))
        );
    }

    addPost(newPost: AppPost): Observable<AppPost> {
        return this._postsApi.addPost(newPost);
    }

    updatePost(post: AppPost): Observable<AppPost> {
        return this._postsApi.updatePost(post);
    }

    deletePost(id: number): Observable<void> {
        return this._postsApi.deletePost(id);
    }
}
