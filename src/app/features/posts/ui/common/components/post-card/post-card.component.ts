import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Post} from "../../../../common/models/post.model";
import {FormsModule} from "@angular/forms";
import {PostViewComponent} from "../../../dumb/post-view/post-view.component";
import {PostEditComponent} from "../../../dumb/post-edit/post-edit.component";
import {EditPostForm} from "../../models/post-form.model";
import {POST_STATES} from "../../const/post-states.const";

// TODO: вынести type (models?). Надо подумать
export type PostState = 'empty' | 'view' | 'edit';

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

    public currentStatePost: PostState = POST_STATES.VIEW

    public editPostForm: EditPostForm = {
        title: '',
        body: ''
    };

    onDeletePost(id: number): void {
        this.postDeleted.emit(id)
    }

    onStartEditPost(): void {
        if (!this.post) return

        this.currentStatePost = POST_STATES.EDIT

        this.editPostForm = {
            title: this.post.title,
            body: this.post.body
        }
    }

    onCancelEdit(): void {
        this.currentStatePost = POST_STATES.VIEW
    }

    onSavePost(post: Post): void {
        if (!this.post) return

        const updatedPost: Post = {
            ...post,
            title: this.editPostForm.title,
            body: this.editPostForm.body
        }

        this.currentStatePost = POST_STATES.VIEW
        this.postEdited.emit(updatedPost)
    }
}
