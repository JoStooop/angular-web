import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from "../ui/dumb/header/header.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, HeaderComponent, MatProgressSpinnerModule, MatCard, MatCardContent, MatIcon, MatButtonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {

    reloadPage() {
        window.location.reload()
    }
}
