import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Post} from "../../features/posts/common/models/post.model";
import {PostsService} from "../../features/posts/application/services/posts.service";
import {PostCardComponent} from "../../features/posts/ui/common/components/post-card/post-card.component";

interface PostForm {
    title: string
    body: string
}

type SortColumn = 'title' | 'body'

@Component({
    selector: 'apps-posts',
    imports: [
        PostCardComponent,
        FormsModule,
    ],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {
    public isLoading: boolean = false

    public isOpenFilterMenu: boolean = false
    public sortColumn: SortColumn | null = null;

    public search: string = ''
    public posts: Post[] = []

    public filteredPosts: Post[] = []

    public formGroup: PostForm = {
        title: '',
        body: ''
    }

    constructor(public postsService: PostsService) {
    }

    // loading в tap ?
    ngOnInit(): void {
        this.isLoading = true
        this.postsService.loadPosts(20).subscribe({
            next: (posts) => {
                this.posts = posts
                this.filteredPosts = [...posts]
            },
            error: (error) => console.log('error', error),
            complete: () => this.isLoading = false
        })
    }

    public handleSearch(): void {
        this.filteredPosts = this.posts.filter(post => post.body.toLowerCase().includes(this.search.toLowerCase()))
    }

    // Здесь что-то не так. вернуться
    public handleDelete(id: number): void {
        this.postsService.deletePost(id).subscribe({
            next: () => {
                this.posts = this.posts.filter(post => post.id !== id)
                this.filteredPosts = this.filteredPosts.filter(post => post.id !== id)
            }
        })
    }

    // Надо что-то придумать чтобы от этого избавиться, тригерить как-то posts чтобы обновлялся
    public handelEditPost(post: Post): void {
        this.postsService.updatePost(post).subscribe({
            next: () => {
                this.posts = this.posts.map(p => p.id === post.id ? post : p)
                this.filteredPosts = this.filteredPosts.map(p => p.id === post.id ? post : p)
            }
        })
    }

    public handleFormCreatePost(): void {
        // event.preventDefault(); - видимо не нужен?

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
