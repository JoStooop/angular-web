import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {AppFilterSelection, FilterOption} from "../../../core/common/models/filter-option.model";

@Component({
    selector: 'app-filter-option',
    standalone: true,
    imports: [
        MatFormField,
        MatLabel,
        MatOption,
        MatSelect,
    ],
    templateUrl: './filter-option.component.html',
    styleUrl: './filter-option.component.scss'
})
export class FilterOptionComponent {
    @Input() filterOptions: AppFilterSelection[] = [];
    @Input() activeFilter: FilterOption | null = null;
    @Output() filterChanged = new EventEmitter<FilterOption>();
}
