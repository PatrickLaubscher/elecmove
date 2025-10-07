import { Component, inject, OnInit, signal } from '@angular/core';
import { PrivateTitleService } from '../../../services/private-title.service';
import { AuthentificationService } from '../../../api/authentication/authentification.service';
import { BookingService } from '../../../api/booking/booking.service';
import { StationService } from '../../../api/station/station.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-dashboard-homepage',
  imports: [],
  templateUrl: './dashboard-homepage.component.html',
  styleUrl: './dashboard-homepage.component.css'
})
export class DashboardHomepageComponent {

  protected readonly authService = inject(AuthentificationService);
  protected readonly stationService = inject(StationService);
  protected readonly bookingService = inject(BookingService);
  protected readonly snackBar = inject(MatSnackBar);


  readonly pendingStatusId = 1;
  readonly stations = this.stationService.getAll();
  readonly pendingBookings = this.bookingService.getAllByStationOwnerAndStatus(this.pendingStatusId);
  
  readonly actualBookings = this.bookingService.getAllUpcoming();


  updateBookingStatus(id:string, statusId:number) {
    return this.bookingService.updateBookingStatus(id, statusId).subscribe(
      {
        next: () => {
          this.pendingBookings.reload();
          if(statusId == 2) {
            this.snackBar.open('Réservation pour la borne confirmée :)', 'Ok', {duration: 5000, verticalPosition:'top'});
          } else {
            this.snackBar.open('Réservation annulée :(', 'Ok', {duration: 5000, verticalPosition:'top'});
          }
          
        },
        error:  (err) => console.error('Erreur dans la mise à jour de la réservation')
      }
    )
  }

}
