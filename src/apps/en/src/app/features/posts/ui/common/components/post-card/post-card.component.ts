import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Post} from "../../../../common/models/post.interface";
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
    @Output() deleted = new EventEmitter<number>()
    @Output() edited = new EventEmitter<Post>()

    public isEditPost: boolean = false
    public editForm: PostForm = {
        title: '',
        body: ''
    };

    emitDeleted(id: number): void {
        this.deleted.emit(id)
    }

    handleEdit(): void {
        if (!this.post) return

        this.isEditPost = true

        this.editForm = {
            title: this.post.title,
            body: this.post.body
        }
    }

    cancelEdit(): void {
        this.isEditPost = false
    }

    saveEdit(): void {
        if (!this.post) return

        const updatedPost: Post = {
            ...this.post,
            title: this.editForm.title,
            body: this.editForm.body
        }
        this.edited.emit(updatedPost)

        this.isEditPost = false
    }
}
