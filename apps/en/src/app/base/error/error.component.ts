import {Component} from '@angular/core';
import {Location} from '@angular/common';

import { RouterLink } from "@angular/router"
import {ROUTE_PATHS} from "../../core/common/const/route-paths";

@Component({
    selector: 'apps-error',
    standalone: true,
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
