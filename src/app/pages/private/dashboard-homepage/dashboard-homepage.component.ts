import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthentificationService } from '../../../api/authentication/authentification.service';
import { BookingService } from '../../../api/booking/booking.service';
import { StationService } from '../../../api/station/station.service';
import { FavoriteStationService } from '../../../api/favorite-station/favorite-station.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PdfReceiptService } from '../../../services/pdf-receipt.service';
import { ExcelExportService } from '../../../services/excel-export.service';
import { Booking } from '../../../shared/entities';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StandardModalComponent } from "../../../components/standard-modal/standard-modal.component";


@Component({
  selector: 'app-dashboard-homepage',
  imports: [RouterLink, CommonModule, FormsModule, StandardModalComponent],
  templateUrl: './dashboard-homepage.component.html',
  styleUrl: './dashboard-homepage.component.css'
})
export class DashboardHomepageComponent implements OnInit {

  protected readonly authService = inject(AuthentificationService);
  protected readonly stationService = inject(StationService);
  protected readonly bookingService = inject(BookingService);
  protected readonly favoriteStationService = inject(FavoriteStationService);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly pdfReceiptService = inject(PdfReceiptService);
  protected readonly excelExportService = inject(ExcelExportService);

  readonly favoriteStationsMap = signal<Map<string, string>>(new Map()); // stationId -> favoriteId

  readonly pendingStatusId = 1;
  readonly stations = this.stationService.getAll();
  readonly pendingBookings = this.bookingService.getAllByStationOwnerAndStatus(this.pendingStatusId);
  readonly isRefuseModalOpen = signal<boolean>(false);
  readonly pendingBookingToRefuse = signal<Booking | null>(null);

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
            this.isRefuseModalOpen.set(false);
            this.pendingBookingToRefuse.set(null);
          }

        },
        error:  () => console.error('Erreur dans la mise à jour de la réservation')
      }
    )
  }

  cancelRefuse() {
      this.pendingBookingToRefuse.set(null);
      this.isRefuseModalOpen.set(false);
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

  ngOnInit() {
    this.loadFavorites();
    this.checkPendingBookings();
  }

  private checkPendingBookings() {
    this.bookingService.getAllByStationOwnerAndStatusObservable(this.pendingStatusId).subscribe({
      next: (bookings) => {
        if (bookings && bookings.length > 0) {
          const message = bookings.length === 1
            ? 'Vous avez 1 réservation en attente de validation'
            : `Vous avez ${bookings.length} réservations en attente de validation`;

          this.snackBar.open(message, 'Voir', {
            duration: 8000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          }).onAction().subscribe(() => {
            document.getElementById('reservations-a-traiter')?.scrollIntoView({ behavior: 'smooth' });
          });
        }
      }
    });
  }

  private loadFavorites() {
    this.favoriteStationService.getAllObservable().subscribe({
      next: (favorites) => {
        const map = new Map<string, string>();
        favorites.forEach(fav => {
          if (fav.station?.id && fav.id) {
            map.set(fav.station.id, fav.id);
          }
        });
        this.favoriteStationsMap.set(map);
      },
      error: () => {
        this.favoriteStationsMap.set(new Map());
      }
    });
  }

  isStationFavorite(stationId: string): boolean {
    return this.favoriteStationsMap().has(stationId);
  }

  toggleFavorite(stationId: string) {
    if (this.isStationFavorite(stationId)) {
      const favoriteId = this.favoriteStationsMap().get(stationId);
      if (favoriteId) {
        this.favoriteStationService.delete(favoriteId).subscribe({
          next: () => {
            const newMap = new Map(this.favoriteStationsMap());
            newMap.delete(stationId);
            this.favoriteStationsMap.set(newMap);
            this.snackBar.open('Borne retirée des favoris', 'Ok', { duration: 3000, verticalPosition: 'top' });
          },
          error: () => this.snackBar.open('Erreur lors de la suppression du favori', 'Ok', { duration: 3000, verticalPosition: 'top' })
        });
      }
    } else {
      this.favoriteStationService.add({ stationId }).subscribe({
        next: (newFavorite) => {
          const newMap = new Map(this.favoriteStationsMap());
          if (newFavorite.id) {
            newMap.set(stationId, newFavorite.id);
          }
          this.favoriteStationsMap.set(newMap);
          this.snackBar.open('Borne ajoutée aux favoris', 'Ok', { duration: 3000, verticalPosition: 'top' });
        },
        error: () => this.snackBar.open('Erreur lors de l\'ajout aux favoris', 'Ok', { duration: 3000, verticalPosition: 'top' })
      });
    }
  }

}
