import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCardContent, MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {IAppPost} from "../../../application/common/models/post.interface";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
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
export class PostFormComponent implements OnInit {
    @Input() set isCreatePostLoading(isCreatePostLoading: boolean) {
        this.isCreatePostLoading$.next(isCreatePostLoading);
    }

    @Output() submitForm: EventEmitter<Partial<IAppPost>> = new EventEmitter<Partial<IAppPost>>()

    submit$: Subject<void> = new Subject<void>();

    isCreatePostLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

    formGroup: FormGroup = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(2)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)])
    });

    ngOnInit(): void {
        this.initializeSideEffects()
    }

    private initializeSideEffects(): void {
        this.submit$
            .pipe(untilDestroyed(this))
            .subscribe(() => {
                this.submitForm.emit(this.formGroup.value)
                this.formGroup.reset()
            })
    }
}
