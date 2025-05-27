import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Post} from "../../../common/models/post.interface";
import {MatCardModule} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TruncatePipe} from "../../../../../ui/pipes/truncate.pipe";

@Component({
    selector: 'app-post-view',
    standalone: true,
    imports: [MatCardModule, MatButton, MatIconModule, TruncatePipe],
    templateUrl: './post-view.component.html',
    styleUrl: './post-view.component.scss'
})
export class PostViewComponent {
    @Input () post!: Post
    @Output() deletePost = new EventEmitter<void>()
    @Output() editPost = new EventEmitter<void>()

}
