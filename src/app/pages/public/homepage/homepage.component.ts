import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { InteractiveMapComponent } from '../../../components/interactive-map/interactive-map.component';
import { CustomerReviewsComponent } from './customer-reviews/customer-reviews.component';
import {RouterLink} from '@angular/router';


@Component({
    selector: 'app-homepage',
    standalone: true,
    imports: [InteractiveMapComponent, CustomerReviewsComponent, HeroComponent, RouterLink],
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
