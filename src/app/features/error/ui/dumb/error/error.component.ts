import {Component} from '@angular/core';
import {Location} from '@angular/common';
import { RouterLink } from "@angular/router"
import {MatCardModule} from '@angular/material/card';
import {ROUTE_PATHS} from "../../../../../core/common/const/route-paths.const";
import {MatButton} from "@angular/material/button";

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
    ROUTE = ROUTE_PATHS;

    constructor(private location: Location) {}

    goBack(): void {
        this.location.back()
    }
}
