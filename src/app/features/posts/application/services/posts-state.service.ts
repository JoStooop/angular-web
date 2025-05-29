import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {AppPost} from "../common/models/post.interface";
import {LoadingStatus} from "../../../../application/common/models/loading-status.type";
import {PostsUseCaseService} from "./posts-use-case.service";
import {FilterOption} from "../../../../core/common/models/filter-option.model";

@Injectable({
    providedIn: 'root'
})
export class PostsStateService {
    postsService = inject(PostsUseCaseService)

    private _posts$ = new BehaviorSubject<AppPost[]>([])
    private _isStatusLoading$ = new BehaviorSubject<LoadingStatus>('idle')
    private _activeFilter$ = new BehaviorSubject<FilterOption | null>(null)
    private _searchQuery$ = new BehaviorSubject<string>('')

    posts$ = this._posts$.asObservable()
    isStatusLoading$ = this._isStatusLoading$.asObservable()
    activeFilter$ = this._activeFilter$.asObservable()
    searchQuery$ = this._searchQuery$.asObservable()

    constructor() {
    }

    // TODO: переписать на pipe

    loadPosts(limit?: number): void {
        this._isStatusLoading$.next('loading')
        this.postsService.getPosts(limit).subscribe({
            next: (posts) => {
                this._posts$.next(posts)
                this._isStatusLoading$.next('succeeded')
            },
            error: () => this._isStatusLoading$.next('failed'),
        })
    }

    addPost(newPost: AppPost): void {
        this.postsService.addPost(newPost).subscribe({
            next: () => {
                const currentPosts = this._posts$.getValue() || []
                this._posts$.next([...currentPosts, newPost])
            },
        })
    }

    updatePost(post: AppPost): void {
        this.postsService.updatePost(post).subscribe({
            next: () => {
                const currentPosts = this._posts$.getValue() || []
                this._posts$.next(currentPosts.map(p => p.id === post.id ? post : p))
            },
        })
    }

    deletePost(id: number): void {
        this.postsService.deletePost(id).subscribe({
            next: () => {
                const currentPosts = this._posts$.getValue()
                this._posts$.next(currentPosts.filter((post) => post.id !== id))
            },
        })
    }

    setActiveFilter(filter: FilterOption | null): void {
        this._activeFilter$.next(filter)
    }

    setSearchQuery(query: string): void {
        this._searchQuery$.next(query)
    }

}
