import { Component, inject } from '@angular/core';
import { CustomerReviewsComponent } from './customer-reviews/customer-reviews.component';
import { HeroComponent } from "./hero/hero.component";
import { InteractiveMapComponent } from '../../interactive-map/interactive-map.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
    selector: 'app-homepage',
    standalone: true,
    imports: [InteractiveMapComponent, CustomerReviewsComponent, HeroComponent],
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
