import {Injectable} from '@angular/core';
import {BehaviorSubject, from, map, Observable, tap} from "rxjs";
import {AppPost} from "../common/models/post.interface";
import {PostsApiService} from "../../../../application/services/posts.api.service";

@Injectable({
    providedIn: 'root'
})
export class PostsUseCaseService {
    _activePostOperations$ = new BehaviorSubject<LoadingOperation[]>([])

    constructor(private postsApiService: PostsApiService) {
    }

    getPosts(limitPosts?: number): Observable<AppPost[]> {
        return this.postsApiService.get<AppPost[]>(limitPosts);
    }

    addPost(newPost: AppPost): Observable<AppPost> {
        this.addLoadingOperation('add', newPost.id)
        return this.postsApiService.post(newPost).pipe(
            tap(() => this.removeLoadingOperation('add', newPost.id))
        );
    }

    updatePost(updatedPost: { title: string, body: string }): Observable<AppPost> {
        // return this.postsApiService.patch<Post>(updatedPost);
        return from([]);
    }

    deletePost(postId: number): Observable<AppPost> {
        this.addLoadingOperation('delete', postId)
        return this.postsApiService.delete<AppPost>(postId).pipe(
            tap(() => this.removeLoadingOperation('delete', postId))
        );
    }

    isPostLoading(postId: number, operation: OperationType): Observable<boolean> {
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

    private addLoadingOperation(operation: OperationType, postId: number): void {
        const currentOperations = this._activePostOperations$.value
        this._activePostOperations$.next([...currentOperations, {operation, postId}])
    }

    private removeLoadingOperation(operation: OperationType, postId: number): void {
        console.log(operation, postId)
        const currentOperations = this._activePostOperations$.value
        // const filteredOperations = currentOperations.filter(operator => operator.postId !== postId)
        const filteredOperations = currentOperations.filter(
            operator => !(operator.postId === postId && operator.operation === operation)
        );
        this._activePostOperations$.next(filteredOperations)
    }
}

type OperationType = 'get' | 'add' | 'update' | 'delete'

interface LoadingOperation {
    operation: OperationType;
    postId: number;
}
