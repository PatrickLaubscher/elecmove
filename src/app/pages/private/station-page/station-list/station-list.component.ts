import { Component, input, output } from '@angular/core';
import { Station } from '../../../../shared/entities';
import { StationCardComponent } from "../station-card/station-card.component";

@Component({
  selector: 'app-station-list',
  imports: [StationCardComponent],
  templateUrl: './station-list.component.html',
  styleUrl: './station-list.component.css'
})
export class StationListComponent {

  readonly stations = input.required<Station[]>();
  readonly editStation = output<Station>();
  readonly deleteStation = output<Station>();

  onEdit(station: Station) {
    this.editStation.emit(station);
  }

  onDelete(station: Station) {
    this.deleteStation.emit(station);
  }

}
