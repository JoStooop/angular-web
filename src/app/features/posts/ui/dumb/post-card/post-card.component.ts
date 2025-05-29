import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppPost} from "../../../application/common/models/post.interface";
import {FormsModule} from "@angular/forms";
import {PostViewComponent} from "../post-view/post-view.component";
import {PostEditComponent} from "../post-edit/post-edit.component";
import {AppNewPostForm, ViewEditMode} from "../../../application/common/models/post-form.interface";
import {POST_CARD_MODES} from "../../common/const/post-states.const";

@Component({
    selector: 'app-post-card',
    standalone: true,
    imports: [CommonModule, FormsModule, PostViewComponent, PostEditComponent],
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {
    @Input() post!: AppPost
    @Output() postDeleted = new EventEmitter<number>()
    @Output() postEdited = new EventEmitter<AppPost>()

    readonly POST_CARD_MODES = POST_CARD_MODES;

    isPostViewMode: ViewEditMode = POST_CARD_MODES.VIEW
    newPostForm: AppNewPostForm = {title: '', body: ''};

    onDeletePost(id: number): void {
        this.postDeleted.emit(id)
    }

    onStartEditPost(): void {
        if (!this.post) return

        this.isPostViewMode = POST_CARD_MODES.EDIT

        this.newPostForm = {
            title: this.post.title,
            body: this.post.body
        }
    }

    onCancelEdit(): void {
        this.isPostViewMode = POST_CARD_MODES.VIEW
    }

    onSavePost(): void {
        if (!this.post) return

        const updatedPost: AppPost = {
            ...this.post,
            title: this.newPostForm.title,
            body: this.newPostForm.body
        }

        this.isPostViewMode = POST_CARD_MODES.VIEW
        this.postEdited.emit(updatedPost)
    }
}
