import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {UntilDestroy} from "@ngneat/until-destroy";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    BehaviorSubject,
    combineLatestWith,
    map,
    merge,
    mergeMap,
    Observable,
    scan,
    shareReplay,
    startWith,
    Subject,
    switchMap,
    tap
} from "rxjs";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatButton} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {
    IAppAddPostEvent, IAppPost, IAppDeletePostEvent, AppPostEvent, IAppUpdatePostEvent
} from "../../../application/common/models/post.interface";
import {PostsUseCaseService} from "../../../application/services/posts-use-case.service";
import {AppLoadingStatus} from "../../../../../application/common/models/loading-status.type";
import {CoreFilterOptions, ICoreFilterSelections} from "../../../../../core/common/models/filter-options.model";
import {PostFormComponent} from "../../dumb/post-form/post-form.component";
import {FilterDropdownComponent} from "../../../../../ui/dumb/filter-dropdown/filter-dropdown.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {filters, nameFilters} from "../../common/const/filters.const";
import {PostCardComponent} from "../post-card/post-card.component";

@UntilDestroy()
@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [
        FormsModule,
        MatProgressSpinner,
        PostFormComponent,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButton,
        FilterDropdownComponent,
        AsyncPipe,
        ReactiveFormsModule,
        PostCardComponent
    ],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {
    originalPosts$: Observable<IAppPost[]>;
    modifiedPosts$: Observable<IAppPost[]>
    activeFilter$: Observable<CoreFilterOptions | null>;

    isPostsLoading$: BehaviorSubject<AppLoadingStatus> = new BehaviorSubject<AppLoadingStatus>('idle');

    applyFilter$: Subject<CoreFilterOptions> = new Subject<CoreFilterOptions>();
    updatePost$: Subject<IAppPost> = new Subject<IAppPost>();
    deletePost$: Subject<number> = new Subject<number>();
    resetFilter$: Subject<void> = new Subject<void>();
    createPost$: Subject<Partial<IAppPost>> = new Subject<Partial<IAppPost>>();

    searchPostControl: FormControl = new FormControl('');

    readonly filters: ICoreFilterSelections[] = filters;

    constructor(private postsUseCaseService: PostsUseCaseService, private snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.originalPosts$ = this.postsUseCaseService.getPosts(20).pipe(shareReplay(1))

        this.activeFilter$ = merge(
            this.applyFilter$.pipe(map(type => type)),
            this.resetFilter$.pipe(map(() => null))
        ).pipe(shareReplay(1))

        this.modifiedPosts$ = merge(
            this.originalPosts$.pipe(map(originalPosts => ({
                action: 'init',
                payload: this.clearEverySecondTitleAndFifthBody(originalPosts)
            }))),
            this.deletePost$.pipe(map(postId => ({action: 'delete', payload: postId}))),
            this.updatePost$.pipe(map(updatedPost => ({action: 'update', payload: updatedPost}))),
            this.createPost$.pipe(map((formData) => this.createPostPayload(formData))),
        ).pipe(
            scan((state: IAppPost[], event: AppPostEvent): IAppPost[] => {
                switch (event.action) {
                    case 'init':
                        return event.payload;
                    case 'delete':
                        return state.filter(post => post.id !== event.payload);
                    case 'update':
                        return state.map(post => post.id === event.payload.id ? event.payload : post);
                    case 'add':
                        return [...state, event.payload];
                    default:
                        return state;
                }
            }, []),
            combineLatestWith(
                this.activeFilter$.pipe(startWith(null)),
                this.searchPostControl.valueChanges.pipe(startWith(''))
            ),
            map(([posts, filter, query]) => this.applyFilterAndSearchByPosts(posts, filter, query)),
            shareReplay(1)
        );

        this.initializeSideEffects()
    }

    private applyFilterToPosts(posts: IAppPost[], filter: CoreFilterOptions | null): IAppPost[] {
        if (!filter) return [...posts]

        const hasTitle = (post: IAppPost) => post.title.length > 0;
        const hasBody = (post: IAppPost) => post.body.length > 0;

        switch (filter) {
            case nameFilters.hasTitle.label:
                return posts.filter(hasTitle)
            case nameFilters.hasBody.label:
                return posts.filter(hasBody);
            case nameFilters.noTitle.label:
                return posts.filter(post => !hasTitle(post))
            case nameFilters.noBody.label:
                return posts.filter(post => !hasBody(post))
            default:
                return [...posts]
        }
    }

    private searchQueryByPosts(posts: IAppPost[], query: string): IAppPost[] {
        if (!query) return [...posts]

        return posts.filter(post => post.body.toLowerCase().includes(query.toLowerCase()))
    }

    private applyFilterAndSearchByPosts(posts: IAppPost[], filter: CoreFilterOptions | null, query: string): IAppPost[] {
        let result = [...posts]

        if (filter) result = this.applyFilterToPosts(result, filter)
        if (query) result = this.searchQueryByPosts(result, query)

        return result
    }

    private clearEverySecondTitleAndFifthBody(posts: IAppPost[]): IAppPost[] {
        return posts.map((post, index) => ({
            ...post,
            title: index % 2 === 1 ? '' : post.title,
            body: index % 5 === 4 ? '' : post.body,
        }))
    }

    private createPostPayload(formData: any): any {
        return {
            action: 'add',
            payload: {
                id: Date.now(),
                userId: 2,
                ...formData,
            }
        };
    }

    private initializeSideEffects() {
        this.createPost$.pipe(
            map((formData: any): IAppPost => this.createPostPayload(formData).payload),
            switchMap((newPost) =>
                this.postsUseCaseService.addPost(newPost).pipe(
                    map((): IAppAddPostEvent => ({action: 'add', payload: newPost})),
                )
            ),
        ).subscribe(() => tap(() => this.snackBar.open('Post created', 'Close', {duration: 2000})))

        this.deletePost$.pipe(
            mergeMap(postId =>
                this.postsUseCaseService.deletePost(postId).pipe(
                    map((): IAppDeletePostEvent => ({action: 'delete', payload: postId})),
                )
            ),
        ).subscribe(() => this.snackBar.open('Post deleted', 'Close', {duration: 2000}))

        this.updatePost$.pipe(
            tap(clg => console.log(clg)),
            switchMap(updatedPost =>
                this.postsUseCaseService.updatePost(updatedPost).pipe(
                    map((): IAppUpdatePostEvent => ({action: 'update', payload: updatedPost})),
                )
            ),
        ).subscribe(() => this.snackBar.open('Post updated', 'Close', {duration: 2000}))
    }
}
