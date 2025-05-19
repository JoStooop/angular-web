import {Routes} from '@angular/router';
import {ROUTE_PATHS} from "./common/constants/route-paths";

export const routes: Routes = [
    {
        path: ROUTE_PATHS.HOME.PATH,
        title: ROUTE_PATHS.HOME.TITLE,
        loadComponent: () => import('@base/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: ROUTE_PATHS.POSTS.PATH,
        title: ROUTE_PATHS.POSTS.TITLE,
        loadComponent: () => import('@base/posts/posts.component').then(m => m.PostsComponent)
    },
    {
        path: ROUTE_PATHS.ERROR.PATH,
        title: ROUTE_PATHS.ERROR.TITLE,
        loadComponent: () => import('@base/error/error.component').then(m => m.ErrorComponent)
    }
];
