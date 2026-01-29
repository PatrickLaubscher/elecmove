import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InteractiveMapComponent } from '../../../components/interactive-map/interactive-map.component';

@Component({
  selector: 'app-find-station-page',
  imports: [InteractiveMapComponent],
  templateUrl: './find-station-page.component.html',
  styleUrl: './find-station-page.component.css'
})
export class FindStationPageComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);

  readonly centerLat = signal<number | undefined>(undefined);
  readonly centerLng = signal<number | undefined>(undefined);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['lat'] && params['lng']) {
        this.centerLat.set(parseFloat(params['lat']));
        this.centerLng.set(parseFloat(params['lng']));
      }
    });
  }

}
