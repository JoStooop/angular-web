import {Component} from '@angular/core';
import {Location} from '@angular/common';

import { RouterLink } from "@angular/router"
import {ROUTE_PATHS} from "../../shared/constants/route-paths";

@Component({
    selector: 'app-error',
    imports: [
        RouterLink
    ],
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss'
})
export class ErrorComponent {
    ROUTE = ROUTE_PATHS;

    constructor(private location: Location) {}

    goBack(): void {
        // Почему-то при клике обновляет стр., но возвращает. Делал как в доке
        this.location.back()
    }
}
