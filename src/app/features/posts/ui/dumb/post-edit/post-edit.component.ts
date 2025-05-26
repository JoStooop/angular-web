import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Post} from "../../../common/models/post.interface";
import {EditPostForm} from "../../common/models/post-form.interface";
import {MatButton} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-post-edit',
    standalone: true,
    imports: [MatCardModule, MatButton, MatIconModule, FormsModule],
    templateUrl: './post-edit.component.html',
    styleUrl: './post-edit.component.scss'
})
export class PostEditComponent {
    @Input() post!: Post
    @Input() editPostForm!: EditPostForm
    @Output() savePost = new EventEmitter<void>()
    @Output() cancelEdit = new EventEmitter<void>()
}
