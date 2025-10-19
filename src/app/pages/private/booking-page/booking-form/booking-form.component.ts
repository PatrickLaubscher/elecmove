import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StandardModalComponent } from '../../../../components/standard-modal/standard-modal.component';
import { CarFormComponent } from '../../car-page/car-form/car-form.component';
import { BookingCreationDTO } from '../../../../api/dto';
import { Car, Station } from '../../../../shared/entities';
import { CarService } from '../../../../api/car/car.service';
import { endAfterStartValidator, futureDateValidator } from '../../../../shared/validators';


@Component({
  selector: 'app-booking-form',
  imports: [ReactiveFormsModule, CommonModule,  StandardModalComponent, CarFormComponent],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})

export class BookingFormComponent implements OnInit {

  protected readonly isMapModalOpen = signal(false);
  protected readonly isCarModalOpen = signal(false);
  protected readonly carService = inject(CarService);
  readonly cars = this.carService.getAll();
  readonly stationSelected = input<Station>();
  readonly carSelected = input<Car>();
  readonly bookingFormSubmit = output<{booking: BookingCreationDTO}>();

  private readonly now = new Date();

  private readonly formatDate = (d: Date) => d.toISOString().substring(0, 10);
  private readonly formatTime = (d: Date) => d.toTimeString().substring(0, 5);

  private getInitialStart(): Date {
    const start = new Date(this.now);
    start.setHours(this.now.getHours() + 1, 0, 0, 0);
    return start;
  }

  private getInitialEnd(): Date {
    const start = this.getInitialStart();
    return new Date(start.getTime() + 30 * 60 * 1000);
  }

  get today(): string {
    const tzOffset = this.now.getTimezoneOffset() * 60000;
    return new Date(this.now.getTime() - tzOffset).toISOString().split('T')[0];
  }


  protected readonly form = new FormGroup({
      date: new FormControl<string>(new Date().toISOString().substring(0, 10), {validators: [Validators.required, futureDateValidator]}),
      startTime: new FormControl<string>(this.formatTime(this.getInitialStart()), {validators: [Validators.required]}),
      endTime:  new FormControl<string>(this.formatTime(this.getInitialEnd()), {validators: [Validators.required]}
      ),
      carId: new FormControl<string>('', {validators: [Validators.required]}),
      stationId: new FormControl<string>('', {validators: [Validators.required]})
    },
    { validators: [endAfterStartValidator]}
  );

  
  ngOnInit() {
    if(this.stationSelected()?.id){
      this.form.patchValue({ stationId: this.stationSelected()!.id });
    }
    if(this.carSelected()?.id){
      this.form.patchValue({ carId: this.carSelected()!.id });
    }

    this.form.get('startTime')?.valueChanges.subscribe(start => {
      if (start) {
        const [h, m] = start.split(':').map(Number);
        const end = new Date();
        end.setHours(h, m + 30);
        const formattedEnd = end.toTimeString().substring(0, 5);
        this.form.patchValue({ endTime: formattedEnd }, { emitEvent: false });
      }
    });
  }


  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsDirty();
      return;
    }
    const newBooking:BookingCreationDTO = {
      date: this.form.value.date!,
      startTime: this.form.value.startTime!,
      endTime: this.form.value.endTime!,
      carId: this.form.value.carId!,
      stationId: this.form.value.stationId!
    }

    this.bookingFormSubmit.emit({booking:newBooking});

  }

}
