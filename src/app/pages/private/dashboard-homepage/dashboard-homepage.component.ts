import { Component, inject, OnInit } from '@angular/core';
import { PrivateTitleService } from '../../../services/private-title.service';
import { AuthentificationService } from '../../../api/authentication/authentification.service';
import { BookingService } from '../../../api/booking/booking.service';
import { StationService } from '../../../api/station/station.service';





@Component({
  selector: 'app-dashboard-homepage',
  imports: [],
  templateUrl: './dashboard-homepage.component.html',
  styleUrl: './dashboard-homepage.component.css'
})
export class DashboardHomepageComponent implements OnInit {

  protected readonly authService = inject(AuthentificationService);
  protected readonly stationService = inject(StationService);
  protected readonly bookingService = inject(BookingService);
  protected readonly titleService = inject(PrivateTitleService);

  ngOnInit(): void {
    this.titleService.setTitle('Accueil');
    console.log(this.stations);
  }

  readonly stations = this.stationService.getAll();



}
