import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {ROUTE_PATHS} from "../../constants/route-paths";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    ROUTE = ROUTE_PATHS;
}
