import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppPost} from "../../../application/common/models/post.interface";
import {FormsModule} from "@angular/forms";
import {PostViewComponent} from "../../dumb/post-view/post-view.component";
import {PostEditComponent} from "../../dumb/post-edit/post-edit.component";
import {IAppNewPostForm, AppViewEditMode} from "../../../application/common/models/post-form.interface";
import {POST_CARD_MODES} from "../../common/const/post-states.const";
import {Observable, shareReplay, Subject, tap} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {PostsUseCaseService} from "../../../application/services/posts-use-case.service";

@UntilDestroy()
@Component({
    selector: 'app-post-card',
    standalone: true,
    imports: [CommonModule, FormsModule, PostViewComponent, PostEditComponent],
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {
    @Input() set post(post: AppPost) {
        this._post = post;
        this.isPostViewMode = POST_CARD_MODES.VIEW
    }

    get post(): AppPost {
        return this._post;
    }

    @Output() postDeleted$: EventEmitter<number> = new EventEmitter<number>()
    @Output() postEdited$: EventEmitter<AppPost> = new EventEmitter<AppPost>()

    isDeletePostLoading$!: Observable<boolean>

    startEditPost$: Subject<void> = new Subject<void>()
    cancelEditPost$: Subject<void> = new Subject<void>()
    savePost$: Subject<void> = new Subject<void>()

    readonly POST_CARD_MODES = POST_CARD_MODES;

    isPostViewMode: AppViewEditMode = POST_CARD_MODES.VIEW
    newPostForm: IAppNewPostForm = {title: '', body: ''};

    _post!: AppPost

    constructor(private postsUseCaseService: PostsUseCaseService) {
    }


    ngOnInit() {
        this.isDeletePostLoading$ = this.postsUseCaseService.isPostLoading(this.post.id, 'delete')

        this.initializeSideEffects()
    }

    private initializeSideEffects(): void {

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
                this.postEdited$.emit(updatedPost)
            })
    }
}
