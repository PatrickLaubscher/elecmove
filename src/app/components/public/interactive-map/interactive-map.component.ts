import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable, inject, signal } from '@angular/core';
import { Map, MapStyle, Marker, Popup } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import * as maptilersdk from '@maptiler/sdk';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { StationService } from '../../../shared/services/station.service';
import { Station } from '../../../shared/entities';


@Component({
  selector: 'app-interactive-map',
  imports: [],
  templateUrl: './interactive-map.component.html',
  styleUrl: './interactive-map.component.css'
})

export class InteractiveMapComponent implements OnInit, AfterViewInit, OnDestroy {

  private stationService = inject(StationService);
  private subscription!: Subscription;
  stations = this.stationService.stations;
  map: Map | undefined;
  private isDark = false;
  private isHybrid = false;
  
  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    maptilersdk.config.apiKey = 'GC5T8jKrwWEDcC6F741K';
  }

  ngAfterViewInit() {
    //const initialState = { lng: 4.850000, lat: 45.750000, zoom: 14 };

    this.map = new maptilersdk.Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      //center: [initialState.lng, initialState.lat],
      //zoom: initialState.zoom,
      zoom: 14,
      geolocate: true,
    });

    const btnDarkMode = document.createElement('button');
    btnDarkMode.innerText = '🌓';
    btnDarkMode.style.cssText = `
      border: none;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    `;

    const btnHybridMode = document.createElement('button');
    btnHybridMode.innerText = '🛰️';
    btnHybridMode.style.cssText = `
      border: none;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    `;

    btnDarkMode.onclick = () => {
      this.isDark = !this.isDark;
      const newStyle = this.isDark
        ? maptilersdk.MapStyle.STREETS.DARK
        : maptilersdk.MapStyle.STREETS;
      this.map?.setStyle(newStyle);
    };

    btnHybridMode .onclick = () => {
      this.isHybrid = !this.isHybrid; 
      const newStyle = this.isHybrid
        ? maptilersdk.MapStyle.HYBRID 
        : maptilersdk.MapStyle.STREETS;
      this.map?.setStyle(newStyle);
    };

    const controlContainer = document.createElement('div');
    controlContainer.className = 'maplibregl-ctrl maplibregl-ctrl-group';
    controlContainer.appendChild(btnDarkMode);
    controlContainer.appendChild(btnHybridMode);

    this.map.addControl(
      {
        onAdd: () => controlContainer,
        onRemove: () => {}
      },
      'top-right'
    );

    new Marker({color: "#FF0000"})
    .setLngLat([4.850000,45.750000])
    .setPopup(new Popup().setHTML("<h1>Borne 1</h1>"))
    .addTo(this.map);

    const iconRed = document.createElement('div');
    iconRed.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10 2H9c-2.828 0-4.243 0-5.121.879C3 3.757 3 5.172 3 8v13.25H2a.75.75 0 0 0 0 1.5h15.25a.75.75 0 0 0 0-1.5H16v-3.5h1.571c.375 0 .679.304.679.679v.071a2.25 2.25 0 1 0 4.5 0V7.602c0-.157 0-.265-.006-.37a3.75 3.75 0 0 0-1.24-2.582a9 9 0 0 0-.286-.236l-1.25-1a.75.75 0 1 0-.936 1.172l1.233.986c.144.116.194.156.237.195c.443.397.711.954.745 1.549a6 6 0 0 1 .003.306V8h-.75A1.5 1.5 0 0 0 19 9.5v2.419a1.5 1.5 0 0 0 1.026 1.423l1.224.408v4.75a.75.75 0 0 1-1.5 0v-.071a2.18 2.18 0 0 0-2.179-2.179H16V8c0-2.828 0-4.243-.879-5.121C14.243 2 12.828 2 10 2m-.114 7.357a.75.75 0 0 1 .257 1.029l-.818 1.364H11a.75.75 0 0 1 .643 1.136l-1.5 2.5a.75.75 0 1 1-1.286-.772l.818-1.364H8a.75.75 0 0 1-.643-1.136l1.5-2.5a.75.75 0 0 1 1.029-.257" clip-rule="evenodd"/></svg>`; 
    iconRed.style.fontSize = '24px';
    iconRed.classList.add('text-noir', 'bg-vert', 'rounded-full', 'p-1', 'shadow-md', 'border-2', 'border-rouge', 'hover:shadow-lg', 'transition-shadow', 'duration-200');


    new Marker({element: iconRed})
    .setLngLat([4.850000,45.760000])
    .setPopup(new Popup().setHTML(
      '<h1>Borne 1</h1>'
      + '<p>Adresse : 1 rue de la République</p>'
      + '<p>Type : Borne de recharge</p>'
      + '<p>Réservée de 10h jusqu\'à 14h</p>'
    ))
    .addTo(this.map);

    this.subscription = this.stationService.getStation().subscribe((stations: Station[]) => {
      stations.forEach(station => {
        const iconBlue = document.createElement('div');
        iconBlue.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10 2H9c-2.828 0-4.243 0-5.121.879C3 3.757 3 5.172 3 8v13.25H2a.75.75 0 0 0 0 1.5h15.25a.75.75 0 0 0 0-1.5H16v-3.5h1.571c.375 0 .679.304.679.679v.071a2.25 2.25 0 1 0 4.5 0V7.602c0-.157 0-.265-.006-.37a3.75 3.75 0 0 0-1.24-2.582a9 9 0 0 0-.286-.236l-1.25-1a.75.75 0 1 0-.936 1.172l1.233.986c.144.116.194.156.237.195c.443.397.711.954.745 1.549a6 6 0 0 1 .003.306V8h-.75A1.5 1.5 0 0 0 19 9.5v2.419a1.5 1.5 0 0 0 1.026 1.423l1.224.408v4.75a.75.75 0 0 1-1.5 0v-.071a2.18 2.18 0 0 0-2.179-2.179H16V8c0-2.828 0-4.243-.879-5.121C14.243 2 12.828 2 10 2m-.114 7.357a.75.75 0 0 1 .257 1.029l-.818 1.364H11a.75.75 0 0 1 .643 1.136l-1.5 2.5a.75.75 0 1 1-1.286-.772l.818-1.364H8a.75.75 0 0 1-.643-1.136l1.5-2.5a.75.75 0 0 1 1.029-.257" clip-rule="evenodd"/></svg>`;
        iconBlue.style.fontSize = '24px';
        iconBlue.classList.add('text-noir', 'bg-vert', 'rounded-full', 'p-1', 'shadow-md', 'border-2', 'border-bleu', 'hover:shadow-lg', 'transition-shadow', 'duration-200');
    
        new Marker({ element: iconBlue })
          .setLngLat([station.lng, station.lat])
          .setPopup(new Popup().setHTML(
            `<h1>Borne</h1>
             <p>Adresse : ${station.adresse}</p>
             <p>Type : ${station.type}</p>
             <button class="w-max mx-auto my-2 block cursor-pointer font-medium uppercase px-2 py-2 rounded-md bg-noir text-blanc hover:text-vert ease-in-out duration-200" type="submit"> Réserver </button>`
          ))
          .addTo(this.map!);
      });
    });
  }
    
  ngOnDestroy() {
    this.map?.remove();
    this.subscription?.unsubscribe();
  }
  
}
