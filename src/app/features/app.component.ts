import {Component} from '@angular/core';
import {HeaderComponent} from "../ui/dumb/header/header.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterOutlet} from "@angular/router";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [HeaderComponent, MatProgressSpinnerModule, MatCard, MatCardContent, MatIcon, MatButtonModule, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {

    reloadPage() {
        window.location.reload()
    }
}
