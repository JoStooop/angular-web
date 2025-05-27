import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Post} from "../../../common/models/post.interface";
import {PostsService} from "../../../application/services/posts.service";
import {PostCardComponent} from "../../dumb/post-card/post-card.component";
import {LoadingStatus} from "../../../../../core/common/models/loading-status.type";
import {EditPostForm} from "../../common/models/post-form.interface";
import {FilterType} from "../../common/models/filter-type.type";
import {map} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {PostFormComponent} from "../../dumb/post-form/post-form.component";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";

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
        MatButton
    ],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {
    public postsLoadingStatus: LoadingStatus = 'idle'
    public activeFilter: FilterType | null = null;
    public searchQuery: string = ''

    public posts: Post[] = []
    public filteredPosts: Post[] = []

    public formGroup: EditPostForm = {
        title: '',
        body: ''
    }

    public filters: { label: FilterType }[] = [
        {label: 'hasTitle'},
        {label: 'hasBody'},
        {label: 'noTitle'},
        {label: 'noBody'}
    ];

    constructor(public postsService: PostsService) {
    }

    private filterPosts(posts: Post[], filter: FilterType | null): Post[] {
        const hasTitle = (post: Post) => post.title.length > 0;
        const hasBody = (post: Post) => post.body.length > 0;

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

    private searchPosts(posts: Post[], query: string): Post[] {
        if (!query) return [...posts]

        return posts.filter(post => post.body.toLowerCase().includes(query.toLowerCase()))
    }

    private filtersAndSearchPosts(posts: Post[], filter: FilterType | null, query: string): Post[] {
        let result = [...posts]

        if (filter) result = this.filterPosts(result, filter)
        if (query) result = this.searchPosts(result, query)

        return result
    }

    ngOnInit(): void {
        this.postsLoadingStatus = 'loading'
        this.postsService.getPosts(20).pipe(
            map((posts: Post[]) => posts.map((post, index): Post => {
                if (index % 2 === 1) post.title = ''
                if (index % 5 === 4) post.body = ''

                return post
            }))
        ).subscribe({
            next: (posts) => {
                this.posts = posts
                this.filteredPosts = [...posts]
            },
            error: () => this.postsLoadingStatus = 'failed',
            complete: () => this.postsLoadingStatus = 'succeeded'
        })
    }

    public searchPostsByBody(): void {
        this.filteredPosts = this.filtersAndSearchPosts(this.posts, this.activeFilter, this.searchQuery)
    }

    public deletePost(id: number): void {
        this.postsService.deletePost(id).subscribe({
            next: () => {
                this.posts = this.posts.filter(post => post.id !== id)
                this.filteredPosts = this.filteredPosts.filter(post => post.id !== id)
            },
        })
    }

    public updatePost(post: Post): void {
        this.postsService.updatePost(post).subscribe({
            next: () => {
                this.posts = this.posts.map(p => p.id === post.id ? post : p)
                this.filteredPosts = this.filteredPosts.map(p => p.id === post.id ? post : p)
            },
        })
    }

    public createPost(): void {
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

    public resetFilters(): void {
        this.activeFilter = null;
        this.filteredPosts = this.filtersAndSearchPosts(this.posts, this.activeFilter, this.searchQuery)
    }

    public applyFilters(type: FilterType): void {
        this.activeFilter = type;
        this.filteredPosts = this.filtersAndSearchPosts(this.posts, this.activeFilter, this.searchQuery)
    }
}
