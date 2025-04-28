import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-interactive-map',
  imports: [],
  templateUrl: './interactive-map.component.html',
  styleUrl: './interactive-map.component.css'
})
export class InteractiveMapComponent implements OnInit, AfterViewInit  {

  private map!: L.Map
  markers: L.Marker[] = [
    L.marker([23.7771, 90.3994]) // Dhaka, Bangladesh
  ];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initMap();
  }


  private initMap() {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.map = L.map('map', {
      center: [23.7771, 90.3994], // Position de départ
      zoom: 13
    });
  
    L.tileLayer(baseMapURl, {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  
    this.markers.forEach(marker => marker.addTo(this.map));
  
    // Force une fois que tout est affiché
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100); // un petit délai pour être sûr (100ms plutôt que 0ms)
  }


}
