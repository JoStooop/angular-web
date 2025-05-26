import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Post} from "../../../common/models/post.interface";
import {FormsModule} from "@angular/forms";
import {PostViewComponent} from "../post-view/post-view.component";
import {PostEditComponent} from "../post-edit/post-edit.component";
import {EditPostForm, PostStatus} from "../../common/models/post-form.interface";
import {POST_STATES} from "../../common/const/post-states.const";

@Component({
    selector: 'app-post-card',
    standalone: true,
    imports: [CommonModule, FormsModule, PostViewComponent, PostEditComponent],
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {
    @Input() post!: Post
    @Output() postDeleted = new EventEmitter<number>()
    @Output() postEdited = new EventEmitter<Post>()

    // TODO: буду дорабатывать состояние EMPTY
    protected readonly POST_STATES = POST_STATES;

    public currentStatusPost: PostStatus = POST_STATES.VIEW

    public editPostForm: EditPostForm = {
        title: '',
        body: ''
    };

    onDeletePost(id: number): void {
        this.postDeleted.emit(id)
    }

    onStartEditPost(): void {
        if (!this.post) return

        this.currentStatusPost = POST_STATES.EDIT

        this.editPostForm = {
            title: this.post.title,
            body: this.post.body
        }
    }

    onCancelEdit(): void {
        this.currentStatusPost = POST_STATES.VIEW
    }

    onSavePost(): void {
        if (!this.post) return

        const updatedPost: Post = {
            ...this.post,
            title: this.editPostForm.title,
            body: this.editPostForm.body
        }

        this.currentStatusPost = POST_STATES.VIEW
        this.postEdited.emit(updatedPost)
    }
}
