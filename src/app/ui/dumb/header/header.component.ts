import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatNavList} from "@angular/material/list";
import {CORE_ROUTE_PATHS} from "../../../core/common/const/route-paths.const";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatIconButton,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        MatNavList,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    ROUTE = CORE_ROUTE_PATHS;
}
