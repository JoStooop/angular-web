import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Post} from "../../features/posts/common/models/post.model";
import {PostsService} from "../../features/posts/application/services/posts.service";
import {PostCardComponent} from "../../features/posts/ui/common/components/post-card/post-card.component";
import {LoadingStatus} from "../../core/common/models/loadingStatus.model";
import {EditPostForm} from "../../features/posts/ui/common/models/post-form.model";

type SortColumn = 'title' | 'body'

@Component({
    selector: 'apps-posts',
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
    public sortColumn: SortColumn | null = null;

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

    public isSorted(column: SortColumn): boolean {
        return this.sortColumn === column;
    }

    handleResetFilter(): void {
        this.sortColumn = null;
        this.filteredPosts = [...this.posts];
    }

    handleSort(column: SortColumn): void {
        this.sortColumn = column;
        this.filteredPosts = [...this.posts].sort((a, b) => a[column] > b[column] ? 1 : -1);
        this.isOpenFilterMenu = false;
    }
}
