import {Component, inject} from '@angular/core';
import {OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {UntilDestroy} from "@ngneat/until-destroy";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
    BehaviorSubject,
    catchError,
    combineLatestWith,
    filter,
    map, merge, mergeMap,
    Observable,
    of, scan, shareReplay,
    startWith,
    Subject, switchMap,
    tap,
} from "rxjs";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatButton} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {AppPost} from "../../../application/common/models/post.interface";
import {PostsUseCaseService} from "../../../application/services/posts-use-case.service";
import {LoadingStatus} from "../../../../../application/common/models/loading-status.type";
import {AppFilterSelection, FilterOption} from "../../../../../core/common/models/filter-option.model";
import {PostCardComponent} from "../post-card/post-card.component";
import {PostFormComponent} from "../../dumb/post-form/post-form.component";
import {FilterOptionComponent} from "../../../../../ui/dumb/filter-option/filter-option.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@UntilDestroy()
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
    postsUseCase = inject(PostsUseCaseService);
    private _snackBar = inject(MatSnackBar)

    originalPosts$!: Observable<AppPost[]>;
    modifiedPosts$!: Observable<AppPost[]>

    isPostsLoading$: BehaviorSubject<LoadingStatus> = new BehaviorSubject<LoadingStatus>('idle');
    activeFilter$!: Observable<FilterOption | null>;

    deletePost$: Subject<number> = new Subject<number>();
    updatePost$: Subject<AppPost> = new Subject<AppPost>();
    createPost$: Subject<void> = new Subject<void>();
    applyFilter$: Subject<FilterOption> = new Subject<FilterOption>();
    resetFilter$: Subject<void> = new Subject<void>();

    searchPostControl: FormControl = new FormControl('');
    createPostFormGroup: FormGroup = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(2)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)])
    });

    filterOptions: AppFilterSelection[] = [
        {label: 'hasTitle'},
        {label: 'hasBody'},
        {label: 'noTitle'},
        {label: 'noBody'}
    ];


    isCreatePostLoading$!: Observable<boolean>

    // TODO: добить обработку ошибок в catchError
    ngOnInit(): void {
        this.isCreatePostLoading$ = this.postsUseCase.isCreatePostLoading()


        this.originalPosts$ = this.postsUseCase.getPosts(20).pipe(
            tap(() => this.isPostsLoading$.next('loading')),
            catchError(() => {
                this.isPostsLoading$.next('failed')
                this._snackBar.open('Failed to fetch posts', 'Close', {duration: 3000})
                return of([])
            }),
            shareReplay(1),
            tap(() => this.isPostsLoading$.next('succeeded'))
        )

        this.activeFilter$ = merge(
            this.applyFilter$.pipe(map(type => type)),
            this.resetFilter$.pipe(map(() => null))
        ).pipe(
            shareReplay(1),
        )

        this.modifiedPosts$ = merge(
            this.originalPosts$
                .pipe(map(originalPosts => this.clearEverySecondTitleAndFifthBody(originalPosts))),
            this.deletePost$.pipe(
                mergeMap(id =>
                    this.postsUseCase.deletePost(id).pipe(
                        map(() => ({evt: 'delete', id})),
                    )
                ),
                tap(() => this._snackBar.open('Post deleted', 'Close', {duration: 2000}))
            ),
            this.updatePost$.pipe(
                switchMap(updatedPost =>
                    this.postsUseCase.updatePost(updatedPost).pipe(
                        map(() => ({evt: 'update', post: updatedPost})),
                    )
                ),
                tap(() => this._snackBar.open('Post updated', 'Close', {duration: 2000}))
            ),
            this.createPost$.pipe(
                filter(() => this.createPostFormGroup.valid),
                map(() => ({
                    userId: 2,
                    id: Date.now(),
                    ...this.createPostFormGroup.value
                })),
                switchMap(newPost =>
                    this.postsUseCase.addPost(newPost).pipe(
                        map(() => ({evt: 'add', post: newPost})),
                    )
                ),
                tap(() => {
                    this.createPostFormGroup.reset()
                    this._snackBar.open('Post created', 'Close', {duration: 2000})
                }),
            )
        ).pipe(
            scan((acc: AppPost[], evt: any) => {
                if (Array.isArray(evt)) {
                    return this.clearEverySecondTitleAndFifthBody(evt);
                }

                switch (evt.evt) {
                    case 'delete':
                        return acc.filter(post => post.id !== evt.id);
                    case 'update':
                        return acc.map(post =>
                            post.id === evt.post.id ? evt.post : post
                        );
                    case 'add':
                        return [...acc, evt.post];
                    default:
                        return acc;
                }
            }, []),
            combineLatestWith(
                this.activeFilter$.pipe(startWith(null)),
                this.searchPostControl.valueChanges.pipe(startWith(''))
            ),
            map(([posts, filter, query]) =>
                this.applyFilterAndSearchByPosts(posts, filter, query)
            ),
            shareReplay(1)
        );
    }

    private applyFilterToPosts(posts: AppPost[], filter: FilterOption | null): AppPost[] {
        if (!filter) return [...posts]

        const hasTitle = (post: AppPost) => post.title.length > 0;
        const hasBody = (post: AppPost) => post.body.length > 0;

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

    private searchQueryByPosts(posts: AppPost[], query: string): AppPost[] {
        if (!query) return [...posts]

        return posts.filter(post => post.body.toLowerCase().includes(query.toLowerCase()))
    }

    private applyFilterAndSearchByPosts(posts: AppPost[], filter: FilterOption | null, query: string): AppPost[] {
        let result = [...posts]

        if (filter) result = this.applyFilterToPosts(result, filter)
        if (query) result = this.searchQueryByPosts(result, query)

        return result
    }

    private clearEverySecondTitleAndFifthBody(posts: AppPost[]): AppPost[] {
        return posts.map((post, index) => ({
            ...post,
            title: index % 2 === 1 ? '' : post.title,
            body: index % 5 === 4 ? '' : post.body,
        }))
    }
}
