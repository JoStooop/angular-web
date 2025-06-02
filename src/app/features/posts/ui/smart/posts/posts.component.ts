import {Component, inject} from '@angular/core';
import {OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
    BehaviorSubject,
    catchError,
    combineLatest,
    filter,
    map, merge,
    Observable,
    of, shareReplay,
    startWith,
    Subject, switchMap,
    tap,
    withLatestFrom
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
import {PostCardComponent} from "../../dumb/post-card/post-card.component";
import {PostFormComponent} from "../post-form/post-form.component";
import {FilterOptionComponent} from "../../../../../ui/dumb/filter-option/filter-option.component";

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

    originalPosts$!: Observable<AppPost[]>;
    modifiedPosts$!: Observable<AppPost[]>

    isPostsLoading$: BehaviorSubject<LoadingStatus> = new BehaviorSubject<LoadingStatus>('idle');
    activeFilter$: BehaviorSubject<FilterOption | null> = new BehaviorSubject<FilterOption | null>(null);

    deletePost$: Subject<number> = new Subject<number>();
    updatePost$: Subject<AppPost> = new Subject<AppPost>();
    createPost$: Subject<void> = new Subject<void>();
    applyFilter$: Subject<FilterOption> = new Subject<FilterOption>();
    resetFilter$: Subject<void> = new Subject<void>();

    searchPostControl: FormControl = new FormControl('');
    createPostFormGroup: FormGroup = new FormGroup({
        title: new FormControl('', Validators.minLength(2)),
        body: new FormControl('', Validators.minLength(3))
    });

    filterOptions: AppFilterSelection[] = [
        {label: 'hasTitle'},
        {label: 'hasBody'},
        {label: 'noTitle'},
        {label: 'noBody'}
    ];

    ngOnInit(): void {
        this.originalPosts$ = this.postsUseCase.getPosts(20).pipe(
            tap(() => this.isPostsLoading$.next('loading')),
            catchError(() => of([])),
            shareReplay(1),
            tap(() => this.isPostsLoading$.next('succeeded'))
        );

        this.initializeSideEffects();
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

    private initializeSideEffects(): void {

        const baseModifiedPosts$ = merge(
            this.originalPosts$.pipe(
                map(posts => this.clearEverySecondTitleAndFifthBody(posts))
            ),

            this.deletePost$.pipe(
                tap(id => console.log(id)),
                switchMap(id =>
                    this.postsUseCase.deletePost(id).pipe(
                        withLatestFrom(this.modifiedPosts$),
                        map(([_, modifiedPosts]) => modifiedPosts.filter(post => post.id !== id)),
                        catchError(() => of([]))
                    )
                ),
            ),

            this.updatePost$.pipe(
                switchMap(updatedPost => this.postsUseCase.updatePost(updatedPost).pipe(
                    withLatestFrom(this.modifiedPosts$),
                    map(([_, modifiedPosts]) => modifiedPosts.map(post => post.id === updatedPost.id ? updatedPost : post)),
                    catchError(() => of([]))
                ))
            ),

            this.createPost$.pipe(
                filter(() => this.createPostFormGroup.valid),
                map(() => ({
                    userId: 2,
                    id: Date.now(),
                    ...this.createPostFormGroup.value,
                })),
                switchMap(newPost =>
                    this.postsUseCase.addPost(newPost).pipe(
                        withLatestFrom(this.modifiedPosts$),
                        map(([createdPost, modifiedPosts]) => [...modifiedPosts, createdPost]),
                        catchError(() => of([]))
                    )
                ),
                tap(() => this.createPostFormGroup.reset()),
            )
        )

        this.modifiedPosts$ = combineLatest([
            baseModifiedPosts$,
            this.activeFilter$.pipe(startWith(null)),
            this.searchPostControl.valueChanges.pipe(startWith(''))
        ]).pipe(
            map(([modifiedPosts, activeFilter, searchQuery]) => this.applyFilterAndSearchByPosts(modifiedPosts, activeFilter, searchQuery)),
            untilDestroyed(this)
        );

        this.applyFilter$
            .pipe(untilDestroyed(this))
            .subscribe(type => this.activeFilter$.next(type));

        this.resetFilter$
            .pipe(untilDestroyed(this))
            .subscribe(() => this.activeFilter$.next(null));
    }
}
