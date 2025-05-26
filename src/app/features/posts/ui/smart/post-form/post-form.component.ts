import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {EditPostForm} from "../../common/models/post-form.interface";
import {FormsModule} from "@angular/forms";
import {MatCardContent, MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
    selector: 'app-post-form',
    standalone: true,
    imports: [
        FormsModule,
        MatCardModule,
        MatCardContent,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    templateUrl: './post-form.component.html',
    styleUrl: './post-form.component.scss'
})
export class PostFormComponent {
    @Input() formData!: EditPostForm
    @Output() onSubmit = new EventEmitter<void>()

    private _snackBar = inject(MatSnackBar);

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {duration: 2000});
    }
}
