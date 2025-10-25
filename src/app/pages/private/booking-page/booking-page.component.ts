import { Component, inject, signal } from '@angular/core';
import { BookingFormComponent } from "./booking-form/booking-form.component";
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingService } from '../../../api/booking/booking.service';
import { CarService } from '../../../api/car/car.service';

@Component({
  selector: 'app-booking-page',
  imports: [BookingFormComponent],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.css'
})
export class BookingPageComponent {

  stationId = signal<string>('');

  protected readonly router = inject(Router);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly serverError = signal('');
  private readonly bookingService = inject(BookingService);
  private readonly carService = inject(CarService);
  private readonly snackBar = inject(MatSnackBar);

  


}
