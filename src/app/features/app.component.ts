import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from "../ui/dumb/header/header.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterOutlet} from "@angular/router";
import {Subject} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [HeaderComponent, MatProgressSpinnerModule, MatCard, MatCardContent, MatIcon, MatButtonModule, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

    reloadPage$: Subject<void> = new Subject<void>()

    ngOnInit() {
        this.initializeSideEffects()
    }

    private initializeSideEffects(): void {
        this.reloadPage$
            .pipe(untilDestroyed(this))
            .subscribe(() => window.location.reload())
    }
}
