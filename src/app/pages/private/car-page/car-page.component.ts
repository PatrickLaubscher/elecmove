import { Component, inject, signal } from '@angular/core';
import { CarFormComponent } from "./car-form/car-form.component";
import { CarService } from '../../../api/car/car.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarListComponent } from "./car-list/car-list.component";
import { StandardModalComponent } from '../../../components/standard-modal/standard-modal.component';
import { Car } from '../../../shared/entities';

@Component({
  selector: 'app-car-page',
  imports: [CarFormComponent, CarListComponent, StandardModalComponent],
  templateUrl: './car-page.component.html',
  styleUrl: './car-page.component.css'
})
export class CarPageComponent {

  private readonly carService = inject(CarService);
  private readonly snackBar = inject(MatSnackBar);
  readonly isDisplay = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly carToEdit = signal<Car | null>(null);
  readonly carToDelete = signal<Car | null>(null);

  protected readonly carsList = this.carService.getAll();

  displayForm() {
    this.isDisplay.update((value) => !value);
    if (!this.isDisplay()) {
      this.carToEdit.set(null);
    }
  }

  onEditCar(car: Car) {
    this.carToEdit.set(car);
    this.isDisplay.set(true);
  }

  onDeleteCar(car: Car) {
    this.carToDelete.set(car);
    this.isDeleteModalOpen.set(true);
  }

  confirmDelete() {
    const car = this.carToDelete();
    if (!car) return;

    const idSignal = signal(Number(car.id));
    this.carService.delete(idSignal).subscribe({
      next: () => {
        this.snackBar.open('La voiture a été supprimée avec succès', 'Ok', {
          duration: 5000,
          verticalPosition: 'top'
        });
        this.isDeleteModalOpen.set(false);
        this.carToDelete.set(null);
        this.carsList.reload();
      },
      error: () => {
        this.snackBar.open('Erreur lors de la suppression de la voiture', 'Ok', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    });
  }

  cancelDelete() {
    this.isDeleteModalOpen.set(false);
    this.carToDelete.set(null);
  }

  onFormClosed() {
    this.isDisplay.set(false);
    this.carToEdit.set(null);
    this.carsList.reload();
  }

}
