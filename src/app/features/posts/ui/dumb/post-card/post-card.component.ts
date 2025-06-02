import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppPost} from "../../../application/common/models/post.interface";
import {FormsModule} from "@angular/forms";
import {PostViewComponent} from "../post-view/post-view.component";
import {PostEditComponent} from "../post-edit/post-edit.component";
import {AppNewPostForm, ViewEditMode} from "../../../application/common/models/post-form.interface";
import {POST_CARD_MODES} from "../../common/const/post-states.const";
import {Subject} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
    selector: 'app-post-card',
    standalone: true,
    imports: [CommonModule, FormsModule, PostViewComponent, PostEditComponent],
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {
    @Input() post!: AppPost
    @Output() postDeleted = new EventEmitter<number>()
    @Output() postEdited = new EventEmitter<AppPost>()

    readonly POST_CARD_MODES = POST_CARD_MODES;

    deletePost$: Subject<number> = new Subject<number>()
    startEditPost$: Subject<void> = new Subject<void>()
    cancelEditPost$: Subject<void> = new Subject<void>()
    savePost$: Subject<void> = new Subject<void>()

    isPostViewMode: ViewEditMode = POST_CARD_MODES.VIEW
    newPostForm: AppNewPostForm = {title: '', body: ''};

    ngOnInit() {
        this.initializeSideEffects()
    }

    private initializeSideEffects(): void {
        this.deletePost$
            .pipe(untilDestroyed(this))
            .subscribe(id => this.postDeleted.emit(id))

        this.startEditPost$
            .pipe(untilDestroyed(this))
            .subscribe(() => {
                if (!this.post) return

                this.isPostViewMode = POST_CARD_MODES.EDIT

                this.newPostForm = {
                    title: this.post.title,
                    body: this.post.body
                }
            })

        this.cancelEditPost$
            .pipe(untilDestroyed(this))
            .subscribe(() => this.isPostViewMode = POST_CARD_MODES.VIEW)

        this.savePost$
            .pipe(untilDestroyed(this))
            .subscribe(() => {
                if (!this.post) return

                const updatedPost: AppPost = {
                    ...this.post,
                    title: this.newPostForm.title,
                    body: this.newPostForm.body
                }

                this.isPostViewMode = POST_CARD_MODES.VIEW
                this.postEdited.emit(updatedPost)
            })
    }
}
