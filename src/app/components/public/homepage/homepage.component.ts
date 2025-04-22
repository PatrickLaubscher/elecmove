import { Component } from '@angular/core';
import { InteractiveMapComponent } from "../interactive-map/interactive-map.component";
import { CustomerReviewsComponent } from "../customer-reviews/customer-reviews.component";

@Component({
    selector: 'app-homepage',
    standalone: true,
    imports: [InteractiveMapComponent, CustomerReviewsComponent],
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
