import { Component, input } from '@angular/core';
import { Station } from '../../../../shared/entities';

@Component({
  selector: 'app-station-card',
  imports: [],
  templateUrl: './station-card.component.html',
  styleUrl: './station-card.component.css'
})
export class StationCardComponent {

  readonly station = input.required<Station>();

}
