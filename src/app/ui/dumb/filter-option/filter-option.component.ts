import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {AppFilterSelection, FilterOption} from "../../../core/common/models/filter-option.model";
import {BehaviorSubject} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
    selector: 'app-filter-option',
    standalone: true,
    imports: [
        MatFormField,
        MatLabel,
        MatOption,
        MatSelect,
        AsyncPipe,
    ],
    templateUrl: './filter-option.component.html',
    styleUrl: './filter-option.component.scss'
})
export class FilterOptionComponent {
    _filterOptions!: AppFilterSelection[]
    _activeFilter!: FilterOption | null

    activeFilter$: BehaviorSubject<FilterOption | null> = new BehaviorSubject<FilterOption | null>(null);

    @Input()
    set filterOptions(filterOptions: AppFilterSelection[]) {
        this._filterOptions = filterOptions;
    }

    get filterOptions() {
        return this._filterOptions;
    }

    @Input()
    set activeFilter(activeFilter: FilterOption | null) {
        console.log(activeFilter)
        this._activeFilter = activeFilter;
        this.activeFilter$.next(activeFilter);
    }

    @Output() filterChanged = new EventEmitter<FilterOption>();
}
