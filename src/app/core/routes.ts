import {Routes} from '@angular/router';
import {CORE_ROUTE_PATHS} from "./common/const/route-paths.const";

export const routes: Routes = [
    {
        path: CORE_ROUTE_PATHS.HOME.PATH,
        title: CORE_ROUTE_PATHS.HOME.TITLE,
        loadComponent: () => import('../features/home/ui/dumb/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: CORE_ROUTE_PATHS.POSTS.PATH,
        title: CORE_ROUTE_PATHS.POSTS.TITLE,
        loadComponent: () => import('../features/posts/ui/smart/posts/posts.component').then(m => m.PostsComponent)
    },
    {
        path: CORE_ROUTE_PATHS.ERROR.PATH,
        title: CORE_ROUTE_PATHS.ERROR.TITLE,
        loadComponent: () => import('../features/error/ui/dumb/error/error.component').then(m => m.ErrorComponent)
    }
];
