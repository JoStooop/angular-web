import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/infrastructure/configs/app.config';
import {AppComponent} from "./app/features/app.component";

bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
