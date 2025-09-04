import { Component, inject, OnInit } from '@angular/core';
import { PrivateTitleService } from '../../../../../shared/services/private-title.service';

@Component({
  selector: 'app-dashboard-homepage',
  imports: [],
  templateUrl: './dashboard-homepage.component.html',
  styleUrl: './dashboard-homepage.component.css'
})
export class DashboardHomepageComponent implements OnInit {
  
  titleService = inject(PrivateTitleService);

  ngOnInit(): void {
    this.titleService.setTitle('Accueil');
  }

}
