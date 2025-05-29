import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AppPost} from "../../../application/common/models/post.interface";
import {AppNewPostForm} from "../../../application/common/models/post-form.interface";
import {MatButton} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatInput, MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";

@Component({
    selector: 'app-post-edit',
    standalone: true,
    imports: [MatCardModule, MatButton, MatIconModule, FormsModule, MatInput, MatFormField, MatFormFieldModule, MatInputModule],
    templateUrl: './post-edit.component.html',
    styleUrl: './post-edit.component.scss'
})
export class PostEditComponent {
    @Input() post!: AppPost
    @Input() newPostForm!: AppNewPostForm
    @Output() savePost = new EventEmitter<void>()
    @Output() cancelEdit = new EventEmitter<void>()
}
