import { Component, effect, inject, input, signal } from '@angular/core';
import { StationService } from '../../../../api/station/station.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StationCreationDTO, StationExceptionCreationDTO } from '../../../../api/dto';
import { CommonModule } from '@angular/common';
import { StandardModalComponent } from "../../../../components/standard-modal/standard-modal.component";
import { LocationFormComponent } from "../location-form/location-form.component";
import { LocationStationService } from '../../../../api/location-station/location-station.service';
import { Location, Station, StationException } from '../../../../shared/entities';
import { StationExceptionService } from '../../../../api/station-exception/station-exception.service';

@Component({
  selector: 'app-station-form',
  imports: [ReactiveFormsModule, CommonModule, StandardModalComponent, LocationFormComponent],
  templateUrl: './station-form.component.html',
  styleUrl: './station-form.component.css'
})
export class StationFormComponent {

  private readonly stationService = inject(StationService);
  private readonly locationService = inject(LocationStationService);
  private readonly stationExceptionService = inject(StationExceptionService);
  protected readonly router = inject(Router);
  protected readonly serverError = signal('');
  private readonly snackBar = inject(MatSnackBar);
  protected readonly isLocationModalOpen = signal(false);
  protected readonly isExceptionModalOpen = signal(false);
  protected readonly locationAddress = signal<string>('');
  protected readonly stationExceptions = signal<StationException[]>([]);

  readonly stationToEdit = input<Station | null>(null);

  protected readonly form = new FormGroup({
      name: new FormControl<string>('Borne de recharge', {validators: [Validators.required]}),
      tarification: new FormControl<number|undefined>(undefined, {validators: [Validators.required, Validators.min(0)]}),
      power: new FormControl<string>('', {validators: [Validators.required]}),
      instruction: new FormControl<string>(''),
      freeStanding: new FormControl<boolean>(true, {validators: [Validators.required]}),
      available: new FormControl<boolean>(true, {validators: [Validators.required]}),
      locationStationId: new FormControl<string>('', {validators: [Validators.required]})
    }
  );

  protected readonly exceptionForm = new FormGroup({
    day: new FormControl<string>('', {validators: [Validators.required]}),
    startLocalTime: new FormControl<string>('', {validators: [Validators.required]}),
    endLocalTime: new FormControl<string>('', {validators: [Validators.required]})
  });

  protected readonly daysOfWeek = [
    { value: 'Lundi', label: 'Lundi' },
    { value: 'Mardi', label: 'Mardi' },
    { value: 'Mercredi', label: 'Mercredi' },
    { value: 'Jeudi', label: 'Jeudi' },
    { value: 'Vendredi', label: 'Vendredi' },
    { value: 'Samedi', label: 'Samedi' },
    { value: 'Dimanche', label: 'Dimanche' }
  ];

  constructor() {
    effect(() => {
      const station = this.stationToEdit();
      if (station) {
        this.form.patchValue({
          name: station.name,
          tarification: station.tarification,
          power: station.power,
          instruction: '',
          freeStanding: station.freeStanding,
          available: station.available,
          locationStationId: station.location.id || ''
        });
        this.locationAddress.set(
          `${station.location.address}, ${station.location.zipcode} ${station.location.city}`
        );
        this.loadStationExceptions(station.id);
      }
    });
  }

  loadStationExceptions(stationId: string) {
    this.stationExceptionService.getAllByStation(stationId).subscribe({
      next: (exceptions) => {
        this.stationExceptions.set(exceptions);
      },
      error: () => {
        console.error('Erreur lors du chargement des exceptions');
      }
    });
  }

  getDayLabel(dayValue: string): string {
    const englishToFrench: Record<string, string> = {
      'monday': 'Lundi',
      'tuesday': 'Mardi',
      'wednesday': 'Mercredi',
      'thursday': 'Jeudi',
      'friday': 'Vendredi',
      'saturday': 'Samedi',
      'sunday': 'Dimanche'
    };
    return englishToFrench[dayValue.toLowerCase()] || dayValue;
  }

  addException() {
    const station = this.stationToEdit();
    if (!station || this.exceptionForm.invalid) {
      this.exceptionForm.markAllAsTouched();
      return;
    }

    const exceptionData: StationExceptionCreationDTO = {
      day: this.exceptionForm.value.day!,
      startLocalTime: this.exceptionForm.value.startLocalTime!,
      endLocalTime: this.exceptionForm.value.endLocalTime!,
      stationId: station.id
    };

    console.log('Sending exception data:', exceptionData);

    this.stationExceptionService.add(exceptionData).subscribe({
      next: () => {
        this.snackBar.open('Exception de disponibilité ajoutée', 'Ok', { duration: 3000, verticalPosition: 'top' });
        this.loadStationExceptions(station.id);
        this.exceptionForm.reset();
        this.isExceptionModalOpen.set(false);
      },
      error: () => {
        this.serverError.set('Erreur lors de l\'ajout de l\'exception');
      }
    });
  }

  deleteException(exceptionId: string) {
    const station = this.stationToEdit();
    if (!station) return;

    this.stationExceptionService.delete(exceptionId).subscribe({
      next: () => {
        this.snackBar.open('Exception supprimée', 'Ok', { duration: 3000, verticalPosition: 'top' });
        this.loadStationExceptions(station.id);
      },
      error: () => {
        this.serverError.set('Erreur lors de la suppression de l\'exception');
      }
    });
  }

    
  addNewLocation(newLocation:Location) {
    this.serverError.set('');
    this.locationService.add(newLocation)
      .subscribe({
        next: (location) => {
          this.isLocationModalOpen.set(false);
          this.snackBar.open('La nouvelle localisation de station a été ajoutée', 'Ok', {duration: 5000, verticalPosition:'top'});
          this.form.patchValue({ locationStationId: location.id });
          this.locationAddress.update(() => 
            `${newLocation.address}, ${newLocation.zipcode} ${newLocation.city}`
          )
        },
        error: () => {
            this.serverError.set("Error with server");
        }
    });
  }


  addNewStation(newStation:StationCreationDTO) {
    this.serverError.set('');
    this.stationService.add(newStation)
      .subscribe({
        next: () => {
          this.snackBar.open('Votre nouvelle borne de recharge a été ajoutée', 'Ok', {duration: 5000, verticalPosition:'top'});
        },
        error: () => {
          this.serverError.set("Error with server");
        }
    });
  }

  updateStation(id: string, updatedStation: StationCreationDTO) {
    this.serverError.set('');
    const idSignal = signal(Number(id));
    this.stationService.put(idSignal, updatedStation)
      .subscribe({
        next: () => {
          this.snackBar.open('La borne a été mise à jour avec succès', 'Ok', {duration: 5000, verticalPosition:'top'});
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
    const stationData: StationCreationDTO = {
      name: this.form.value.name!,
      tarification: this.form.value.tarification!,
      power: this.form.value.power!,
      instruction: this.form.value.instruction!,
      freeStanding: this.form.value.freeStanding!,
      available: this.form.value.available!,
      locationStationId: this.form.value.locationStationId!
    }

    const station = this.stationToEdit();
    if (station) {
      this.updateStation(station.id, stationData);
    } else {
      this.addNewStation(stationData);
    }
  }


}
