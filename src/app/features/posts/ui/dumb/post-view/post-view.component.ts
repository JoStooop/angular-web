import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Post} from "../../../common/models/post.model";

@Component({
    selector: 'app-post-view',
    standalone: true,
    imports: [],
    templateUrl: './post-view.component.html',
    styleUrl: './post-view.component.scss'
})
export class PostViewComponent {
    @Input () post!: Post
    @Output() deletePost = new EventEmitter<number>()
    @Output() editPost = new EventEmitter<void>()

}
