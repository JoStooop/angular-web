import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {ICoreFilterSelection, CoreFilterOption} from "../../../core/common/models/filter-option.model";
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
    _filterOptions!: ICoreFilterSelection[]
    _activeFilter!: CoreFilterOption | null

    activeFilter$: BehaviorSubject<CoreFilterOption | null> = new BehaviorSubject<CoreFilterOption | null>(null);

    @Input()
    set filterOptions(filterOptions: ICoreFilterSelection[]) {
        this._filterOptions = filterOptions;
    }

    get filterOptions() {
        return this._filterOptions;
    }

    @Input()
    set activeFilter(activeFilter: CoreFilterOption | null) {
        console.log(activeFilter)
        this._activeFilter = activeFilter;
        this.activeFilter$.next(activeFilter);
    }

    @Output() filterChanged = new EventEmitter<CoreFilterOption>();
}
