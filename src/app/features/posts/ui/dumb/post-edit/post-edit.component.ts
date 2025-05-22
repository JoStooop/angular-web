import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Post} from "../../../common/models/post.model";
import {EditPostForm} from "../../common/models/post-form.interface";

@Component({
    selector: 'app-post-edit',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './post-edit.component.html',
    styleUrl: './post-edit.component.scss'
})
export class PostEditComponent {
    @Input() post!: Post
    @Input() editPostForm!: EditPostForm
    @Output() savePost = new EventEmitter<void>()
    @Output() cancelEdit = new EventEmitter<void>()
}
