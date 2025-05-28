import {Component} from '@angular/core';
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
    posts$: Observable<AppPost[]>
    isStatusLoading$: Observable<LoadingStatus>

    activeFilter: FilterOption | null = null;
    searchQuery: string = ''

    posts: AppPost[] = []
    filteredPosts: AppPost[] = []

    formGroup: AppNewPostForm = {title: '', body: ''}

    filterOptions: AppFilterSelection[] = [
        {label: 'hasTitle'},
        {label: 'hasBody'},
        {label: 'noTitle'},
        {label: 'noBody'}
    ];

    constructor(public postsService: PostsUseCaseService, private stateService: PostsStateService,) {
        this.posts$ = this.stateService.posts$;
        this.isStatusLoading$ = this.stateService.isStatusLoading$
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
        this.stateService.loadPosts(20);
        this.isStatusLoading$.subscribe(() => console.log('status', this.isStatusLoading$))
    }

    searchPostsByBody(): void {
        this.filteredPosts = this.applyFiltersAndSearch(this.posts, this.activeFilter, this.searchQuery)
    }

    // deletePost(id: number): void {
    //     this.postsService.deletePost(id).subscribe({
    //         next: () => {
    //             this.posts = this.posts.filter(post => post.id !== id)
    //             this.filteredPosts = this.filteredPosts.filter(post => post.id !== id)
    //         },
    //     })
    // }

    deletePost(id: number): void {
        this.stateService.deletePost(id);
    }


    // updatePost(post: AppPost): void {
    //     this.postsService.updatePost(post).subscribe({
    //         next: () => {
    //             this.posts = this.posts.map(p => p.id === post.id ? post : p)
    //             this.filteredPosts = this.filteredPosts.map(p => p.id === post.id ? post : p)
    //         },
    //     })
    // }

    updatePost(post: AppPost): void {
        this.stateService.updatePost(post);
    }

    createPost(): void {
        console.log('crPost', this.formGroup)
        const newPost = {
            id: this.posts.length + 1,
            title: this.formGroup.title,
            body: this.formGroup.body,
            userId: 1
        }

        this.postsService.addPost(newPost).subscribe({
            next: () => {
                this.posts = [...this.posts, newPost]
                this.filteredPosts = [...this.filteredPosts, newPost]
            },
            complete: () => this.formGroup = {title: '', body: ''}
        })
    }

    resetFilters(): void {
        this.activeFilter = null;
        this.filteredPosts = this.applyFiltersAndSearch(this.posts, this.activeFilter, this.searchQuery)
    }

    applyFilters(type: FilterOption): void {
        this.activeFilter = type;
        this.filteredPosts = this.applyFiltersAndSearch(this.posts, this.activeFilter, this.searchQuery)
    }
}
