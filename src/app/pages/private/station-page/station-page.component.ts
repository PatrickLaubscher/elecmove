import { Component, inject, signal } from '@angular/core';
import { StationFormComponent } from "./station-form/station-form.component";
import { StationService } from '../../../api/station/station.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StationListComponent } from "./station-list/station-list.component";
import { StandardModalComponent } from '../../../components/standard-modal/standard-modal.component';
import { Station } from '../../../shared/entities';

@Component({
  selector: 'app-station-page',
  imports: [StationFormComponent, StationListComponent, StandardModalComponent],
  templateUrl: './station-page.component.html',
  styleUrl: './station-page.component.css'
})
export class StationPageComponent {

  private readonly stationService = inject(StationService);
  protected readonly router = inject(Router);
  protected readonly serverError = signal('');
  private readonly snackBar = inject(MatSnackBar);
  readonly isDiplay = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly stationToEdit = signal<Station | null>(null);
  readonly stationToDelete = signal<Station | null>(null);

  protected readonly stationsList = this.stationService.getAll();

  displayForm() {
    this.isDiplay.update((value) => !value);
    if (!this.isDiplay()) {
      // Réinitialiser la station à éditer quand on ferme le formulaire
      this.stationToEdit.set(null);
    }
  }

  onEditStation(station: Station) {
    this.stationToEdit.set(station);
    this.isDiplay.set(true);
  }

  onDeleteStation(station: Station) {
    this.stationToDelete.set(station);
    this.isDeleteModalOpen.set(true);
  }

  confirmDelete() {
    const station = this.stationToDelete();
    if (!station) return;

    const idSignal = signal(Number(station.id));
    this.stationService.delete(idSignal).subscribe({
      next: () => {
        this.snackBar.open('La borne a été supprimée avec succès', 'Ok', {
          duration: 5000,
          verticalPosition: 'top'
        });
        this.isDeleteModalOpen.set(false);
        this.stationToDelete.set(null);
        this.stationsList.reload();
      },
      error: () => {
        this.snackBar.open('Erreur lors de la suppression de la borne', 'Ok', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    });
  }

  cancelDelete() {
    this.isDeleteModalOpen.set(false);
    this.stationToDelete.set(null);
  }


}
