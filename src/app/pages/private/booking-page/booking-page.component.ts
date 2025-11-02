import { Component, inject, signal } from '@angular/core';
import { BookingFormComponent } from "./booking-form/booking-form.component";
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingService } from '../../../api/booking/booking.service';
import { BookingCreationDTO } from '../../../api/dto';
import { BookingStorageService } from '../../../services/booking-storage.service';

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
  protected readonly bookingStorageService = inject(BookingStorageService);
  private readonly snackBar = inject(MatSnackBar);


  addBooking(newBooking:BookingCreationDTO) {

    this.bookingService.add(newBooking)
    .subscribe({
      next: () => {
        this.snackBar.open('Votre réservation a bien été enregistrée', 'ok', {duration: 5000, verticalPosition:'top', horizontalPosition:'right'})
        this.bookingStorageService.clearBooking();
      },
      error: () => {
        this.serverError.set("Erreur serveur");
      }
    });

  }

}
