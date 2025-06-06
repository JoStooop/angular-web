import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, tap} from "rxjs";
import {PostsApiService} from "../../../../application/services/posts.api.service";
import {IAppLoadingOperation, IAppPost, AppEventType} from "../common/models/post.interface";

@Injectable({
    providedIn: 'root'
})
export class PostsUseCaseService {
    _activePostOperations$ = new BehaviorSubject<IAppLoadingOperation[]>([])

    constructor(private postsApiService: PostsApiService) {
    }

    getPosts(limitPosts?: number): Observable<IAppPost[]> {
        return this.postsApiService.get<IAppPost[]>(limitPosts);
    }

    addPost(newPost: IAppPost): Observable<IAppPost> {
        this.addLoadingOperation('add', newPost.id)
        return this.postsApiService.post(newPost).pipe(
            tap(() => this.removeLoadingOperation('add', newPost.id))
        );
    }

    updatePost(updatedPost: IAppPost): Observable<IAppPost> {
        this.addLoadingOperation('update', updatedPost.id)
        return this.postsApiService.patch<IAppPost>(updatedPost.id, updatedPost).pipe(
            tap(() => this.removeLoadingOperation('update', updatedPost.id))
        );
    }

    deletePost(postId: number): Observable<IAppPost> {
        this.addLoadingOperation('delete', postId)
        return this.postsApiService.delete<IAppPost>(postId).pipe(
            tap(() => this.removeLoadingOperation('delete', postId))
        );
    }

    isPostLoading(postId: number, operation: AppEventType): Observable<boolean> {
        return this._activePostOperations$.pipe(
            map(operations => {
                    return operations
                        .filter(operator => operator.postId === postId)
                        .some(operator => operator.operation === operation)
                }
            )
        );
    }

    isCreatePostLoading(): Observable<boolean> {
        return this._activePostOperations$.pipe(
            map(operations =>
                operations.some(op => op.operation === 'add')
            )
        );
    }

    private addLoadingOperation(operation: AppEventType, postId: number): void {
        const currentOperations = this._activePostOperations$.value
        this._activePostOperations$.next([...currentOperations, {operation, postId}])
    }

    private removeLoadingOperation(operation: AppEventType, postId: number): void {
        const currentOperations = this._activePostOperations$.value
        const filteredOperations = currentOperations.filter(
            operator => !(operator.postId === postId && operator.operation === operation)
        );
        this._activePostOperations$.next(filteredOperations)
    }
}
