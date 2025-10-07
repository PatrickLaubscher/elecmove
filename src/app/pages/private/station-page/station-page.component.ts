import { Component } from '@angular/core';
import { StationFormComponent } from "./station-form/station-form.component";
import { LocationFormComponent } from './location-form/location-form.component';

@Component({
  selector: 'app-station-page',
  imports: [LocationFormComponent, StationFormComponent],
  templateUrl: './station-page.component.html',
  styleUrl: './station-page.component.css'
})
export class StationPageComponent {

}
