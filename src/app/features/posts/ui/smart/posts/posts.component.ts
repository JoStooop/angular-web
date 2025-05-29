import {Component, inject} from '@angular/core';
import {OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {BehaviorSubject, catchError, combineLatest, map, of, startWith, tap} from "rxjs";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatButton} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {AppPost} from "../../../application/common/models/post.interface";
import {PostsUseCaseService} from "../../../application/services/posts-use-case.service";
import {LoadingStatus} from "../../../../../application/common/models/loading-status.type";
import {AppFilterSelection, FilterOption} from "../../../../../core/common/models/filter-option.model";
import {PostCardComponent} from "../../dumb/post-card/post-card.component";
import {PostFormComponent} from "../post-form/post-form.component";
import {FilterOptionComponent} from "../../../../../ui/dumb/filter-option/filter-option.component";

@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [
        PostCardComponent,
        FormsModule,
        MatProgressSpinner,
        PostFormComponent,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButton,
        FilterOptionComponent,
        AsyncPipe,
        ReactiveFormsModule
    ],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {
    postsService = inject(PostsUseCaseService)

    posts$ = new BehaviorSubject<AppPost[]>([])
    isStatusLoading$ = new BehaviorSubject<LoadingStatus>('idle')
    activeFilter$ = new BehaviorSubject<FilterOption | null>(null)

    searchControl: FormControl = new FormControl('')

    filteredPosts$ = combineLatest([
        this.posts$,
        this.activeFilter$,
        this.searchControl.valueChanges.pipe(startWith(''))
    ]).pipe(
        map(([posts, activeFilter, searchQuery]): AppPost[] => {
            return this.applyFiltersAndSearch(posts, activeFilter, searchQuery)
        })
    )

    formGroup: FormGroup = new FormGroup({
        title: new FormControl('', Validators.minLength(2)),
        body: new FormControl('', Validators.minLength(3))
    })

    filterOptions: AppFilterSelection[] = [
        {label: 'hasTitle'},
        {label: 'hasBody'},
        {label: 'noTitle'},
        {label: 'noBody'}
    ];

    private applyFilterToPosts(posts: AppPost[], filter: FilterOption | null): AppPost[] {
        const hasTitle = (post: AppPost) => post.title.length > 0;
        const hasBody = (post: AppPost) => post.body.length > 0;

        if (!filter) return [...posts]

        switch (filter) {
            case "hasTitle":
                return posts.filter(hasTitle)
            case "hasBody":
                return posts.filter(hasBody);
            case "noTitle":
                return posts.filter(post => !hasTitle(post))
            case "noBody":
                return posts.filter(post => !hasBody(post))
            default:
                return [...posts]
        }
    }

    private searchPostsByQuery(posts: AppPost[], query: string): AppPost[] {
        if (!query) return [...posts]

        return posts.filter(post => post.body.toLowerCase().includes(query.toLowerCase()))
    }

    private applyFiltersAndSearch(posts: AppPost[], filter: FilterOption | null, query: string): AppPost[] {
        let result = [...posts]

        if (filter) result = this.applyFilterToPosts(result, filter)
        if (query) result = this.searchPostsByQuery(result, query)

        return result
    }

    // TODO: сохранить объект ошибки и потом обработать
    ngOnInit(): void {
        this.isStatusLoading$.next('loading')
        this.postsService.getPosts(20).pipe(
            map((posts: AppPost[]) => posts.map((post, index): AppPost => {
                if (index % 2 === 1) post.title = ''
                if (index % 5 === 4) post.body = ''

                return post
            })),
            tap(() => this.isStatusLoading$.next('succeeded')),
            catchError(() => {
                this.isStatusLoading$.next('failed')
                return of([])
            }),
        ).subscribe((posts) => this.posts$.next(posts))
    }

    deletePost(id: number): void {
        const currentPosts = this.posts$.value
        const deletedPost = currentPosts.filter((post) => post.id !== id)

        this.posts$.next(deletedPost)
    }

    updatePost(post: AppPost): void {
        const currentPosts = this.posts$.value
        const updatedPost = currentPosts.map((p) => p.id === post.id ? post : p)

        this.posts$.next(updatedPost)
    }

    createPost(): void {
        if (!this.formGroup.valid) return

        const currentPosts = this.posts$.value

        const newPost = {
            id: this.posts$.value.length + 1,
            userId: 1,
            ...this.formGroup.value
        }

        this.posts$.next([...currentPosts, newPost])
        this.formGroup.reset()
    }

    resetFilters(): void {
        this.activeFilter$.next(null)
    }

    applyFilters(type: FilterOption): void {
        this.activeFilter$.next(type)
    }
}
