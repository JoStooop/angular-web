import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCardContent, MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {AsyncPipe} from "@angular/common";
import {BehaviorSubject} from "rxjs";

@Component({
    selector: 'app-post-form',
    standalone: true,
    imports: [
        FormsModule,
        MatCardModule,
        MatCardContent,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        AsyncPipe,
    ],
    templateUrl: './post-form.component.html',
    styleUrl: './post-form.component.scss'
})
export class PostFormComponent {
    @Input()
    set formGroup(formGroup: FormGroup) {
        this._formGroup = formGroup;
    }

    get formGroup() {
        return this._formGroup;
    }

    @Input()
    set isCreatePostLoading(isCreatePostLoading: boolean) {
        this._isCreatePostLoading = isCreatePostLoading;
        this.isCreatePostLoading$.next(isCreatePostLoading);
    }

    @Output() onSubmit: EventEmitter<void> = new EventEmitter<void>()

    isCreatePostLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

    _formGroup!: FormGroup
    _isCreatePostLoading: boolean = false
}
