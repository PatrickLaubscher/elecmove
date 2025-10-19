import { CommonModule } from '@angular/common';
import { Component, OnInit, output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InteractiveMapComponent } from '../../../../components/interactive-map/interactive-map.component';
import { debounceTime } from 'rxjs';
import { Location } from '../../../../shared/entities';


@Component({
  selector: 'app-location-form',
  imports: [ReactiveFormsModule, CommonModule, InteractiveMapComponent],
  templateUrl: './location-form.component.html',
  styleUrl: './location-form.component.css'
})
export class LocationFormComponent implements OnInit {

  @ViewChild('mapComponent') mapComponent!: InteractiveMapComponent;

  readonly locationFormSubmit = output<{location: Location}>();

  ngOnInit() {
  this.form.get('address')?.valueChanges
    .pipe(debounceTime(400))
    .subscribe(value => {
      if (value && this.mapComponent) {
        this.mapComponent.onSearchInput(value);
      }
    });
  }

  onAddressSelected(addressData: any) {
    this.form.patchValue({
      address: addressData.address,
      city: addressData.city,
      zipcode: addressData.zipcode,
      latitude: addressData.latitude,
      longitude: addressData.longitude
    });
  }


  protected readonly form = new FormGroup({
      address: new FormControl<string>('', {validators: [Validators.required]}),
      city: new FormControl<string>('', {validators: [Validators.required]}),
      zipcode: new FormControl<string>('', {validators: [Validators.required]}),
      latitude: new FormControl<number|undefined>(undefined, {validators: [Validators.required]}),
      longitude: new FormControl<number|undefined>(undefined, {validators: [Validators.required]})
    }
  );

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsDirty();
      return;
    }
    const newLocation:Location = {
      address: this.form.value.address!,
      city: this.form.value.city!,
      zipcode: this.form.value.zipcode!,
      latitude: this.form.value.latitude!,
      longitude: this.form.value.longitude!
    }

    this.locationFormSubmit.emit({location:newLocation});

  }

}
