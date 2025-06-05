import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {RouterLink} from "@angular/router"
import {MatCardModule} from '@angular/material/card';
import {MatButton} from "@angular/material/button";
import {CORE_ROUTE_PATHS} from "../../../../../core/common/const/route-paths.const";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Subject} from "rxjs";

@UntilDestroy()
@Component({
    selector: 'app-error',
    standalone: true,
    imports: [
        RouterLink,
        MatCardModule,
        MatButton
    ],
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss'
})
export class ErrorComponent implements OnInit {
    goBack$: Subject<void> = new Subject<void>()

    ROUTE = CORE_ROUTE_PATHS;

    constructor(private location: Location) {
    }


    ngOnInit(): void {
        this.initializeSideEffects()
    }

    private initializeSideEffects(): void {
        this.goBack$
            .pipe(untilDestroyed(this))
            .subscribe(() => this.location.back())
    }
}
