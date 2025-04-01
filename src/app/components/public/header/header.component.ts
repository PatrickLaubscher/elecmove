import { Component } from '@angular/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { HeroComponent } from "../hero/hero.component";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [NavBarComponent, HeroComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {

}
