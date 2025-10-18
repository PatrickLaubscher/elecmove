import { Component, inject, signal } from '@angular/core';
import { StationFormComponent } from "./station-form/station-form.component";
import { StationService } from '../../../api/station/station.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StationListComponent } from "./station-list/station-list.component";

@Component({
  selector: 'app-station-page',
  imports: [StationFormComponent, StationListComponent],
  templateUrl: './station-page.component.html',
  styleUrl: './station-page.component.css'
})
export class StationPageComponent {

  private readonly stationService = inject(StationService);
  protected readonly router = inject(Router);
  protected readonly serverError = signal('');
  private readonly snackBar = inject(MatSnackBar);
  readonly isDiplay = signal<boolean>(false); 

  protected readonly stationsList = this.stationService.getAll();

  displayForm() {
    this.isDiplay.update((value) => !value);
  }


}
