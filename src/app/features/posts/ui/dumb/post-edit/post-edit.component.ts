import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AppNewPostForm} from "../../../application/common/models/post-form.interface";
import {MatButton} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatInput, MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {BehaviorSubject} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
    selector: 'app-post-edit',
    standalone: true,
    imports: [MatCardModule, MatButton, MatIconModule, FormsModule, MatInput, MatFormField, MatFormFieldModule, MatInputModule, AsyncPipe],
    templateUrl: './post-edit.component.html',
    styleUrl: './post-edit.component.scss'
})
export class PostEditComponent {
    _newPostForm!: AppNewPostForm

    newPostForm$: BehaviorSubject<AppNewPostForm | null> = new BehaviorSubject<AppNewPostForm | null>(null)

    @Input()
    set newPostForm(newPostForm: AppNewPostForm) {
        this._newPostForm = newPostForm;
        this.newPostForm$.next(newPostForm);
    }

    @Output() savePost: EventEmitter<void> = new EventEmitter<void>()
    @Output() cancelEdit: EventEmitter<void> = new EventEmitter<void>()
}
