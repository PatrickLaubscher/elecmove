import { Component, input, output } from '@angular/core';
import { Station } from '../../../../shared/entities';

@Component({
  selector: 'app-station-card',
  imports: [],
  templateUrl: './station-card.component.html',
  styleUrl: './station-card.component.css'
})
export class StationCardComponent {

  readonly station = input.required<Station>();
  readonly editStation = output<Station>();
  readonly deleteStation = output<Station>();

  onEdit() {
    this.editStation.emit(this.station());
  }

  onDelete() {
    this.deleteStation.emit(this.station());
  }

}
