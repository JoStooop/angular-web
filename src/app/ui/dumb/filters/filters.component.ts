import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {FilterType} from "../../../features/posts/ui/common/models/filter-type.type";

@Component({
    selector: 'app-filters',
    standalone: true,
    imports: [
        MatFormField,
        MatLabel,
        MatOption,
        MatSelect,
    ],
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.scss'
})
export class FiltersComponent {
    @Input() filters: { label: FilterType }[] = [];
    @Input() activeFilter: FilterType | null = null;
    @Output() filterChanged = new EventEmitter<FilterType>();

}
