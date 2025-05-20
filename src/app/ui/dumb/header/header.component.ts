import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {ROUTE_PATHS} from "../../../core/common/const/route-paths";

@Component({
    selector: 'apps-header',
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
