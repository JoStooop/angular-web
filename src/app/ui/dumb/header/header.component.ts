import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {ROUTE_PATHS} from "../../../core/common/const/route-paths.const";
import {MatToolbarModule} from "@angular/material/toolbar";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        MatToolbarModule
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    ROUTE = ROUTE_PATHS;
}
