import { Component } from '@angular/core';
import { CustomerReviewsComponent } from '../../public-pages-sections/customer-reviews/customer-reviews.component';
import { HeroComponent } from "../../public-pages-sections/hero/hero.component";
import { InteractiveMapComponent } from '../../public-pages-sections/interactive-map/interactive-map.component';


@Component({
    selector: 'app-homepage',
    standalone: true,
    imports: [InteractiveMapComponent, CustomerReviewsComponent, HeroComponent],
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
