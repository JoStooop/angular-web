import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {BehaviorSubject} from "rxjs";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatFormField, MatLabel} from "@angular/material/input";
import {CoreFilterOptions, ICoreFilterSelections} from "../../../core/common/models/filter-options.model";

@Component({
    selector: 'app-filter-dropdown',
    standalone: true,
    imports: [
        MatFormField,
        MatLabel,
        MatOption,
        MatSelect,
        AsyncPipe,
    ],
    templateUrl: './filter-dropdown.component.html',
    styleUrl: './filter-dropdown.component.scss'
})
export class FilterDropdownComponent {
    @Input() options: ICoreFilterSelections[] = []

    @Input() set selected(activeFilter: CoreFilterOptions | null) {
        this.selected$.next(activeFilter);
    }

    @Output() selectionChange: EventEmitter<CoreFilterOptions> = new EventEmitter<CoreFilterOptions>();

    selected$: BehaviorSubject<CoreFilterOptions | null> = new BehaviorSubject<CoreFilterOptions | null>(null);
}
