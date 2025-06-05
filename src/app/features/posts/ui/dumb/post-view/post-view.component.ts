import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AppPost} from "../../../application/common/models/post.interface";
import {MatCardModule} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TruncatePipe} from "../../../../../ui/pipes/truncate.pipe";
import {AsyncPipe} from "@angular/common";
import {BehaviorSubject} from "rxjs";

@Component({
    selector: 'app-post-view',
    standalone: true,
    imports: [MatCardModule, MatButton, MatIconModule, TruncatePipe, AsyncPipe],
    templateUrl: './post-view.component.html',
    styleUrl: './post-view.component.scss'
})
export class PostViewComponent {
    @Input()
    set post(post: AppPost) {
        this._post = post;
        this.post$.next(post);
    }

    @Input()
    set isDeletePostLoading(isDeletePostLoading: boolean) {
        this._isDeletePostLoading = isDeletePostLoading;
        this.isDeletePostLoading$.next(isDeletePostLoading);
    }

    @Output() deletePost: EventEmitter<void> = new EventEmitter<void>()
    @Output() editPost: EventEmitter<void> = new EventEmitter<void>()


    post$: BehaviorSubject<AppPost | null> = new BehaviorSubject<AppPost | null>(null)
    isDeletePostLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

    _post!: AppPost
    _isDeletePostLoading: boolean = false
}
