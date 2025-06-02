import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCardContent, MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Subject} from "rxjs";

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
        ReactiveFormsModule
    ],
    templateUrl: './post-form.component.html',
    styleUrl: './post-form.component.scss'
})
export class PostFormComponent implements OnInit {
    @Input() formGroup!: FormGroup
    @Output() onSubmit = new EventEmitter<void>()

    createPost$ = new Subject<void>();

    ngOnInit() {
        this.initializeSideEffects()
    }

    private initializeSideEffects(): void {
        this.createPost$
            .pipe(untilDestroyed(this))
            .subscribe(() => {
                if (this.formGroup.valid) {
                    this.onSubmit.emit()
                }
            })
    }
}
