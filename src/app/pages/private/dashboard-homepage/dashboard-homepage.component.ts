import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthentificationService } from '../../../api/authentication/authentification.service';
import { BookingService } from '../../../api/booking/booking.service';
import { StationService } from '../../../api/station/station.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PdfReceiptService } from '../../../services/pdf-receipt.service';
import { ExcelExportService } from '../../../services/excel-export.service';
import { Booking } from '../../../shared/entities';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dashboard-homepage',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './dashboard-homepage.component.html',
  styleUrl: './dashboard-homepage.component.css'
})
export class DashboardHomepageComponent {

  protected readonly authService = inject(AuthentificationService);
  protected readonly stationService = inject(StationService);
  protected readonly bookingService = inject(BookingService);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly pdfReceiptService = inject(PdfReceiptService);
  protected readonly excelExportService = inject(ExcelExportService);

  readonly pendingStatusId = 1;
  readonly stations = this.stationService.getAll();
  readonly pendingBookings = this.bookingService.getAllByStationOwnerAndStatus(this.pendingStatusId);

  readonly actualBookings = this.bookingService.getAllUpcoming();
  readonly pastBookings = this.bookingService.getAllPast();

  // Filtres pour les réservations passées
  readonly searchTerm = signal<string>('');
  readonly selectedMonth = signal<string>('');
  readonly selectedStatus = signal<string>('');

  // Réservations filtrées
  readonly filteredPastBookings = computed(() => {
    const bookings = this.pastBookings.value() || [];
    const search = this.searchTerm().toLowerCase();
    const month = this.selectedMonth();
    const status = this.selectedStatus();

    return bookings.filter(booking => {
      // Filtre par recherche (nom client, adresse, véhicule)
      const matchesSearch = !search ||
        booking.user.firstname.toLowerCase().includes(search) ||
        booking.user.lastname.toLowerCase().includes(search) ||
        booking.station.location.address.toLowerCase().includes(search) ||
        booking.station.location.city.toLowerCase().includes(search) ||
        booking.car.brand.toLowerCase().includes(search);

      // Filtre par mois
      const bookingMonth = new Date(booking.date).toISOString().slice(0, 7);
      const matchesMonth = !month || bookingMonth === month;

      // Filtre par statut
      const matchesStatus = !status || booking.status.name === status;

      return matchesSearch && matchesMonth && matchesStatus;
    });
  });


  updateBookingStatus(id:string, statusId:number, booking?: Booking) {
    return this.bookingService.updateBookingStatus(id, statusId).subscribe(
      {
        next: () => {
          this.pendingBookings.reload();
          if(statusId === 2) {
            this.snackBar.open('Réservation pour la borne confirmée :)', 'Ok', {duration: 5000, verticalPosition:'top'});
            // Générer automatiquement le reçu PDF si la réservation est acceptée
            if(booking) {
              this.generateReceipt(booking);
            }
          } else {
            this.snackBar.open('Réservation annulée :(', 'Ok', {duration: 5000, verticalPosition:'top'});
          }

        },
        error:  () => console.error('Erreur dans la mise à jour de la réservation')
      }
    )
  }

  generateReceipt(booking: Booking) {
    this.pdfReceiptService.generateReceipt(booking);
  }

  exportToExcel() {
    const bookingsToExport = this.filteredPastBookings();
    if (bookingsToExport.length === 0) {
      this.snackBar.open('Aucune réservation à exporter', 'Ok', {
        duration: 3000,
        verticalPosition: 'top'
      });
      return;
    }
    this.excelExportService.exportBookingsToExcel(bookingsToExport);
    this.snackBar.open('Export Excel réussi !', 'Ok', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  resetFilters() {
    this.searchTerm.set('');
    this.selectedMonth.set('');
    this.selectedStatus.set('');
  }

}
