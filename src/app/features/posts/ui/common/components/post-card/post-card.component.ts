import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Post} from "../../../../common/models/post.model";
import {FormsModule} from "@angular/forms";

interface PostForm {
    title: string
    body: string
}

@Component({
    selector: 'apps-post-card',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {
    @Input() post?: Post
    @Output() deletePost = new EventEmitter<number>()
    @Output() editPost = new EventEmitter<Post>()

    public isEditPost: boolean = false
    public editForm: PostForm = {
        title: '',
        body: ''
    };

    deletingPost(id: number): void {
        this.deletePost.emit(id)
    }

    startEditingPost(): void {
        if (!this.post) return

        this.isEditPost = true

        this.editForm = {
            title: this.post.title,
            body: this.post.body
        }
    }

    cancelEditingPost(): void {
        this.isEditPost = false
    }

    submitEditedPost(): void {
        if (!this.post) return

        const updatedPost: Post = {
            ...this.post,
            title: this.editForm.title,
            body: this.editForm.body
        }
        this.editPost.emit(updatedPost)

        this.isEditPost = false
    }
}
