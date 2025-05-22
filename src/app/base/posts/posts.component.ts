import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Post} from "../../features/posts/common/models/post.model";
import {PostsService} from "../../features/posts/application/services/posts.service";
import {PostCardComponent} from "../../features/posts/ui/common/components/post-card/post-card.component";
import {LoadingStatus} from "../../core/common/models/loadingStatus.model";
import {EditPostForm} from "../../features/posts/ui/common/models/post-form.model";

type FilterType = 'title' | 'body' | 'noTitle' | 'noBody'

@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [
        PostCardComponent,
        FormsModule,
    ],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {

    public postsLoadingStatus: LoadingStatus = 'idle'

    public isOpenFilterMenu: boolean = false
    public filterType: FilterType | null = null;

    public search: string = ''
    public posts: Post[] = []

    public filteredPosts: Post[] = []

    public formGroup: EditPostForm = {
        title: '',
        body: ''
    }

    constructor(public postsService: PostsService) {
    }

    ngOnInit(): void {
        this.postsLoadingStatus = 'loading'
        this.postsService.loadPosts(5).subscribe({
            next: (posts) => {
                this.posts = posts
                this.filteredPosts = [...posts]
            },
            error: () => this.postsLoadingStatus = 'failed',
            complete: () => this.postsLoadingStatus = 'succeeded'
        })
    }

    public handleSearch(): void {
        this.filteredPosts = this.posts.filter(post => post.body.toLowerCase().includes(this.search.toLowerCase()))
    }

    public handleDelete(id: number): void {
        this.postsService.deletePost(id).subscribe({
            next: () => {
                this.posts = this.posts.filter(post => post.id !== id)
                this.filteredPosts = this.filteredPosts.filter(post => post.id !== id)
            },
        })
    }

    public handelEditPost(post: Post): void {
        this.postsService.updatePost(post).subscribe({
            next: () => {
                this.posts = this.posts.map(p => p.id === post.id ? post : p)
                this.filteredPosts = this.filteredPosts.map(p => p.id === post.id ? post : p)
            },
        })
    }

    public handleFormCreatePost(): void {
        const newPost = {
            id: this.posts.length + 1, // заглушка
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

    public handleOpenFilterMenu(): void {
        this.isOpenFilterMenu = !this.isOpenFilterMenu
    }

    public isFiltered(type: FilterType): boolean {
        return this.filterType === type;
    }

    handleResetFilter(): void {
        this.filterType = null;
        this.filteredPosts = [...this.posts];
    }

    handleFilter(type: FilterType): void {
        this.filterType = type

        const hasTitle = (post: Post) => post.title.length > 0;
        const hasBody = (post: Post) => post.body.length > 0;

        switch (type) {
            case "title":
                this.filteredPosts = this.posts.filter(hasTitle)
                break;
            case "body":
                this.filteredPosts = this.posts.filter(hasBody);
                break
            case "noTitle":
                this.filteredPosts = this.posts.filter(post => !hasTitle(post))
                break
            case "noBody":
                this.filteredPosts = this.posts.filter(post => !hasBody(post))
                break
            default:
                this.filteredPosts = [...this.posts]

        }
        this.isOpenFilterMenu = false;
    }
}
