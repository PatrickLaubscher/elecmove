import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarService } from '../../../../api/car/car.service';
import { CarCreationDTO } from '../../../../api/dto';
import { BookingStorageService } from '../../../../services/booking-storage.service';
import { Car } from '../../../../shared/entities';

@Component({
  selector: 'app-car-form',
  imports: [ReactiveFormsModule],
  templateUrl: './car-form.component.html',
  styleUrl: './car-form.component.css'
})
export class CarFormComponent {

  protected readonly serverError = signal('');
  private readonly snackBar = inject(MatSnackBar);
  protected readonly carService = inject(CarService);
  protected readonly bookingStorageService = inject(BookingStorageService);

  isCarModalOpen = input<boolean>();
  closingModal = output<boolean>();

  readonly carToEdit = input<Car | null>(null);
  readonly formClosed = output<void>();

  protected readonly form = new FormGroup({
    brand: new FormControl<string>('', {validators: [Validators.required]}),
    type: new FormControl<string>('', {validators: [Validators.required]}),
    registration: new FormControl<string>('', {validators: [Validators.required]}),
    }
  );

  constructor() {
    effect(() => {
      const car = this.carToEdit();
      if (car) {
        this.form.patchValue({
          brand: car.brand,
          type: car.type,
          registration: car.registration
        });
      } else {
        this.form.reset();
      }
    });
  }

  registerNewCar(newCar:CarCreationDTO) {
    this.serverError.set('');
    this.carService.add(newCar)
      .subscribe({
        next: (res) => {
          this.snackBar.open('La voiture a été rajoutée à votre compte', 'Ok', {duration: 5000, verticalPosition:'top', horizontalPosition:'right'});

          if(this.isCarModalOpen() === true) {
            this.closingModal.emit(true);
            this.bookingStorageService.addCarId(res.id);
          } else {
            this.formClosed.emit();
          }

        },
        error: () => {
          this.serverError.set("Error with server");
        }
    });
  }

  updateCar(id: string, updatedCar: CarCreationDTO) {
    this.serverError.set('');
    const idSignal = signal(Number(id));
    this.carService.put(idSignal, updatedCar)
      .subscribe({
        next: () => {
          this.snackBar.open('La voiture a été mise à jour avec succès', 'Ok', {duration: 5000, verticalPosition:'top'});
          this.formClosed.emit();
        },
        error: () => {
          this.serverError.set("Erreur lors de la mise à jour");
        }
      });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsDirty();
      return;
    }
    const carData: CarCreationDTO = {
      brand: this.form.value.brand!,
      type: this.form.value.type!,
      registration: this.form.value.registration!
    }

    const car = this.carToEdit();
    if (car) {
      this.updateCar(car.id, carData);
    } else {
      this.registerNewCar(carData);
    }
  }

}
