import { Component } from '@angular/core';
import { CarFormComponent } from "./car-form/car-form.component";

@Component({
  selector: 'app-car-page',
  imports: [CarFormComponent],
  templateUrl: './car-page.component.html',
  styleUrl: './car-page.component.css'
})
export class CarPageComponent {

}
