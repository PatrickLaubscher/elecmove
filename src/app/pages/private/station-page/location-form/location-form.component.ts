import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocationStationService } from '../../../../api/location-station/location-station.service';
import { LocationCreationDTO } from '../../../../api/dto';
import { InteractiveMapComponent } from '../../../../components/interactive-map/interactive-map.component';


@Component({
  selector: 'app-location-form',
  imports: [ReactiveFormsModule, CommonModule, InteractiveMapComponent],
  templateUrl: './location-form.component.html',
  styleUrl: './location-form.component.css'
})
export class LocationFormComponent {

  private readonly locationService = inject(LocationStationService);
  protected readonly router = inject(Router);
  protected readonly serverError = signal('');
  private readonly snackBar = inject(MatSnackBar);


  protected readonly form = new FormGroup({
      address: new FormControl<string>('', {validators: [Validators.required]}),
      city: new FormControl<string>('', {validators: [Validators.required]}),
      zipcode: new FormControl<string>('', {validators: [Validators.required]}),
      latitude: new FormControl<number|undefined>(undefined, {validators: [Validators.required]}),
      longitude: new FormControl<number|undefined>(undefined, {validators: [Validators.required]})
    }
  );

  
  addNewLocation(newLocation:LocationCreationDTO) {
    this.serverError.set('');
    this.locationService.add(newLocation)
      .subscribe({
        next: () => {
          this.snackBar.open('La nouvelle localisation de station a été ajoutée', 'Ok', {duration: 5000, verticalPosition:'top'});
        },
        error: (err) => {
            this.serverError.set("Error with server");
        }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsDirty();
      return;
    }
    const newLocation:LocationCreationDTO = {
      address: this.form.value.address!,
      city: this.form.value.city!,
      zipcode: this.form.value.zipcode!,
      latitude: this.form.value.latitude!,
      longitude: this.form.value.longitude!
    }

    this.addNewLocation(newLocation);
  }

}
