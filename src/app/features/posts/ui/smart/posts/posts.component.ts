import {Component, inject} from '@angular/core';
import {OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {map, Observable} from "rxjs";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatButton} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {AppPost} from "../../../application/common/models/post.interface";
import {PostsUseCaseService} from "../../../application/services/posts-use-case.service";
import {LoadingStatus} from "../../../../../application/common/models/loading-status.type";
import {AppNewPostForm} from "../../../application/common/models/post-form.interface";
import {AppFilterSelection, FilterOption} from "../../../../../core/common/models/filter-option.model";
import {PostCardComponent} from "../../dumb/post-card/post-card.component";
import {PostFormComponent} from "../post-form/post-form.component";
import {FilterOptionComponent} from "../../../../../ui/dumb/filter-option/filter-option.component";
import {PostsStateService} from "../../../application/services/posts-state.service";
import {AsyncPipe} from "@angular/common";

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
        AsyncPipe
    ],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {
     postsStateService = inject(PostsStateService)

    posts$: Observable<AppPost[]>
    isStatusLoading$: Observable<LoadingStatus>
    activeFilter$: Observable<FilterOption | null>
    searchQuery$: Observable<string>

    // activeFilter: FilterOption | null = null;
    // searchQuery: string = ''

    // posts: AppPost[] = []
    // filteredPosts: AppPost[] = []

    formGroup: AppNewPostForm = {title: '', body: ''}

    filterOptions: AppFilterSelection[] = [
        {label: 'hasTitle'},
        {label: 'hasBody'},
        {label: 'noTitle'},
        {label: 'noBody'}
    ];

    constructor() {
        this.posts$ = this.postsStateService.posts$;
        this.isStatusLoading$ = this.postsStateService.isStatusLoading$
        this.activeFilter$ = this.postsStateService.activeFilter$
        this.searchQuery$ = this.postsStateService.searchQuery$
    }

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

    ngOnInit(): void {
        // this.isPostsLoading = 'loading'
        // this.postsService.getPosts(20).pipe(
        //     map((posts: AppPost[]) => posts.map((post, index): AppPost => {
        //         if (index % 2 === 1) post.title = ''
        //         if (index % 5 === 4) post.body = ''
        //
        //         return post
        //     }))
        // ).subscribe({
        //     next: (posts) => {
        //         this.posts = posts
        //         this.filteredPosts = [...posts]
        //     },
        //     error: () => this.isPostsLoading = 'failed',
        //     complete: () => this.isPostsLoading = 'succeeded'
        // })
        this.postsStateService.loadPosts(20);
    }

    searchPostsByBody(): void {
        this.postsStateService.setSearchQuery(this.formGroup.body)
        // this.searchQuery = this.formGroup.body
        // this.filteredPosts = this.applyFiltersAndSearch(this.posts, this.activeFilter, this.searchQuery)
    }

    deletePost(id: number): void {
        this.postsStateService.deletePost(id);
    }

    updatePost(post: AppPost): void {
        this.postsStateService.updatePost(post);
    }

    createPost(): void {
        // const newPost = {
        //     id: this.posts.length + 1,
        //     title: this.formGroup.title,
        //     body: this.formGroup.body,
        //     userId: 1
        // }
        //
        // this.postsService.addPost(newPost).subscribe({
        //     next: () => {
        //         this.posts = [...this.posts, newPost]
        //         this.filteredPosts = [...this.filteredPosts, newPost]
        //     },
        //     complete: () => this.formGroup = {title: '', body: ''}
        // })
    }

    resetFilters(): void {
        this.postsStateService.setActiveFilter(null)
        // this.activeFilter = null;
        // this.filteredPosts = this.applyFiltersAndSearch(this.posts, this.activeFilter, this.searchQuery)
    }

    applyFilters(type: FilterOption): void {
        this.postsStateService.setActiveFilter(type)
        // this.activeFilter = type;
        // this.filteredPosts = this.applyFiltersAndSearch(this.posts, this.activeFilter, this.searchQuery)
    }
}
