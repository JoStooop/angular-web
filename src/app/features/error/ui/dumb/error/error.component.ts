import {Component} from '@angular/core';
import {Location} from '@angular/common';
import {RouterLink} from "@angular/router"
import {MatCardModule} from '@angular/material/card';
import {MatButton} from "@angular/material/button";
import {CORE_ROUTE_PATHS} from "../../../../../core/common/const/route-paths.const";

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
export class ErrorComponent {
    ROUTE = CORE_ROUTE_PATHS;

    constructor(private location: Location) {
    }

    goBack(): void {
        this.location.back()
    }
}
