import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {map, merge, Observable, scan, shareReplay, Subject} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCard, MatCardActions, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatFormField, MatInput, MatInputModule} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {PostsUseCaseService} from "../../../application/services/posts-use-case.service";
import {TruncatePipe} from "../../../../../ui/pipes/truncate.pipe";
import {IAppPost} from "../../../application/common/models/post.interface";
import {AppPostEditEvent, IPostEditState} from "../../common/models/post-edit.interface";

@UntilDestroy()
@Component({
    selector: 'app-post-card',
    standalone: true,
    imports: [MatInputModule, CommonModule, FormsModule, MatButton, MatCard, MatCardActions, MatCardSubtitle, MatCardTitle, TruncatePipe, MatInput, ReactiveFormsModule, MatFormField],
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {
    @Input() post: IAppPost
    @Output() postDeleted$: EventEmitter<number> = new EventEmitter<number>()
    @Output() updatePost$: EventEmitter<IAppPost> = new EventEmitter<IAppPost>()

    isEditMode$: Observable<boolean>
    isDeletePostLoading$!: Observable<boolean>;
    isUpdatePostLoading$!: Observable<boolean>;

    startEdit$:Subject<void> = new Subject<void>();
    cancelEdit$:Subject<void> = new Subject<void>();
    saveEdit$:Subject<void> = new Subject<void>();

    editForm = new FormGroup({
        title: new FormControl<string>('', {validators: [Validators.required, Validators.minLength(2)]}),
        body: new FormControl<string>('', {validators: [Validators.required, Validators.minLength(3)]}),
    });

    constructor(private postsUseCaseService: PostsUseCaseService) {
    }

    ngOnInit() {
        this.isDeletePostLoading$ = this.postsUseCaseService.isPostLoading(this.post.id, 'delete')
        this.isUpdatePostLoading$ = this.postsUseCaseService.isPostLoading(this.post.id, 'update')

        this.editForm.patchValue({
            title: this.post.title,
            body: this.post.body,
        });

        this.isEditMode$ = merge(
            this.startEdit$.pipe(map(() => ({type: 'start'}))),
            this.cancelEdit$.pipe(map(() => ({type: 'cancel'}))),
            this.saveEdit$.pipe(map(() => ({type: 'save', payload: this.editForm.value}))),
        ).pipe(
            scan((state: IPostEditState, event: AppPostEditEvent): IPostEditState => {
                switch (event.type) {
                    case 'start':
                        return {...state, isEditMode: true};
                    case 'cancel':
                        this.editForm.patchValue({title: this.post.title, body: this.post.body});
                        return {...state, isEditMode: false};
                    case 'save':
                        this.updatePost$.emit({
                            ...this.post,
                            title: event.payload.title,
                            body: event.payload.body,
                        });
                        return {...state, isEditMode: false};
                    default:
                        return state;
                }
            }, {
                isEditMode: false,
                formValues: {title: this.post.title, body: this.post.body}
            }),
            map((state) => state.isEditMode),
            shareReplay(1),
            untilDestroyed(this),
        )
    }
}
