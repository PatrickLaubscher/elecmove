import { Component, inject, signal } from '@angular/core';
import { StationService } from '../../../../api/station/station.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StationCreationDTO } from '../../../../api/dto';

@Component({
  selector: 'app-station-form',
  imports: [],
  templateUrl: './station-form.component.html',
  styleUrl: './station-form.component.css'
})
export class StationFormComponent {

  private readonly stationService = inject(StationService);
  protected readonly router = inject(Router);
  protected readonly serverError = signal('');
  private readonly snackBar = inject(MatSnackBar);


  protected readonly form = new FormGroup({
      name: new FormControl<string>('Borne de recharge', {validators: [Validators.required]}),
      tarification: new FormControl<number|undefined>(undefined, {validators: [Validators.required, Validators.min(0)]}),
      power: new FormControl<string>('', {validators: [Validators.required]}),
      instruction: new FormControl<string>(''),
      freeStanding: new FormControl<boolean>(true, {validators: [Validators.required]}),
      available: new FormControl<boolean>(true, {validators: [Validators.required]}),
      type: new FormControl<string>('', {validators: [Validators.required]}),
      locationStationId: new FormControl<string>('', {validators: [Validators.required]}),
    }
  );

  
  addNewLocation(newStation:StationCreationDTO) {
    this.serverError.set('');
    this.stationService.add(newStation)
      .subscribe({
        next: () => {
          this.snackBar.open('Votre nouvelle borne de recharge a été ajoutée', 'Ok', {duration: 5000, verticalPosition:'top'});
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
    const newStation:StationCreationDTO = {
      name: this.form.value.name!,
      tarification: this.form.value.tarification!,
      power: this.form.value.power!,
      instruction: this.form.value.instruction!,
      freeStanding: this.form.value.freeStanding!,
      available: this.form.value.available!,
      type: this.form.value.type!,
      locationStationId: this.form.value.locationStationId!
    }

    this.stationService.add(newStation);
  }


}
