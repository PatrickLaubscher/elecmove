import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HeroComponent } from '../hero/hero.component';
import { InteractiveMapComponent } from '../../../components/interactive-map/interactive-map.component';
import { CustomerReviewsComponent } from '../customer-reviews/customer-reviews.component';


@Component({
    selector: 'app-homepage',
    standalone: true,
    imports: [InteractiveMapComponent, CustomerReviewsComponent, HeroComponent],
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
