import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Post} from "../../../common/models/post.interface";
import {FormsModule} from "@angular/forms";
import {PostViewComponent} from "../post-view/post-view.component";
import {PostEditComponent} from "../post-edit/post-edit.component";
import {EditPostForm, ViewEditMode} from "../../common/models/post-form.interface";
import {POST_CARD_MODES} from "../../common/const/post-states.const";

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

    protected readonly POST_CARD_MODES = POST_CARD_MODES;

    currentPostViewMode: ViewEditMode = POST_CARD_MODES.VIEW

    protected editPostForm: EditPostForm = {
        title: '',
        body: ''
    };

    protected onDeletePost(id: number): void {
        this.postDeleted.emit(id)
    }

    protected onStartEditPost(): void {
        if (!this.post) return

        this.currentPostViewMode = POST_CARD_MODES.EDIT

        this.editPostForm = {
            title: this.post.title,
            body: this.post.body
        }
    }

    protected onCancelEdit(): void {
        this.currentPostViewMode = POST_CARD_MODES.VIEW
    }

    protected onSavePost(): void {
        if (!this.post) return

        const updatedPost: Post = {
            ...this.post,
            title: this.editPostForm.title,
            body: this.editPostForm.body
        }

        this.currentPostViewMode = POST_CARD_MODES.VIEW
        this.postEdited.emit(updatedPost)
    }
}
