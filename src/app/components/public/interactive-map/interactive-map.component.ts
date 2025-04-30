import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Map, MapStyle, Marker, Popup } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import * as maptilersdk from '@maptiler/sdk';
import { Subscription } from 'rxjs';
import { StationService } from '../../../shared/services/station.service';
import { Station } from '../../../shared/entities';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "@maptiler/geocoding-control/style.css";



@Component({
  selector: 'app-interactive-map',
  imports: [NgIf, NgFor],
  templateUrl: './interactive-map.component.html',
  styleUrl: './interactive-map.component.css'
})

export class InteractiveMapComponent implements OnInit, AfterViewInit, OnDestroy {

  private stationService = inject(StationService);
  private subscription!: Subscription;
  stations = this.stationService.stations;
  map: Map | undefined;
  private positionMarker: Marker | undefined;
  private isDark = false;
  private isHybrid = false;

  searchQuery = '';
  suggestions: any[] = [];


  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    maptilersdk.config.apiKey = 'GC5T8jKrwWEDcC6F741K';
  }
  

  ngAfterViewInit(): void {
    //const initialState = { lng: 4.850000, lat: 45.750000, zoom: 14 };

    this.map = new maptilersdk.Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      language: 'fr',
      //center: [initialState.lng, initialState.lat],
      //zoom: initialState.zoom,
      zoom: 14,
      geolocate: true,
      geolocateControl: false,
      maxBounds: [
        [-5.2, 41.3], 
        [9.7, 51.1] 
      ]
    });

    
    // Ajout d'un boutoon de mode sombre et hybride
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

    //this.map.addControl(gc, 'top-left');
    this.map.addControl(
      {
        onAdd: () => controlContainer,
        onRemove: () => {},
      
      },
      'top-right'
    );

    const stationMarker = document.createElement('div');
    stationMarker.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10 2H9c-2.828 0-4.243 0-5.121.879C3 3.757 3 5.172 3 8v13.25H2a.75.75 0 0 0 0 1.5h15.25a.75.75 0 0 0 0-1.5H16v-3.5h1.571c.375 0 .679.304.679.679v.071a2.25 2.25 0 1 0 4.5 0V7.602c0-.157 0-.265-.006-.37a3.75 3.75 0 0 0-1.24-2.582a9 9 0 0 0-.286-.236l-1.25-1a.75.75 0 1 0-.936 1.172l1.233.986c.144.116.194.156.237.195c.443.397.711.954.745 1.549a6 6 0 0 1 .003.306V8h-.75A1.5 1.5 0 0 0 19 9.5v2.419a1.5 1.5 0 0 0 1.026 1.423l1.224.408v4.75a.75.75 0 0 1-1.5 0v-.071a2.18 2.18 0 0 0-2.179-2.179H16V8c0-2.828 0-4.243-.879-5.121C14.243 2 12.828 2 10 2m-.114 7.357a.75.75 0 0 1 .257 1.029l-.818 1.364H11a.75.75 0 0 1 .643 1.136l-1.5 2.5a.75.75 0 1 1-1.286-.772l.818-1.364H8a.75.75 0 0 1-.643-1.136l1.5-2.5a.75.75 0 0 1 1.029-.257" clip-rule="evenodd"/></svg>`; 
    stationMarker.style.fontSize = '24px';
    stationMarker.classList.add('text-noir', 'bg-vert', 'rounded-full', 'p-1', 'shadow-md', 'border-2', 'border-rouge', 'hover:shadow-lg', 'transition-shadow', 'duration-200');


    new Marker({element: stationMarker})
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
        const stationMarker = document.createElement('div');
        stationMarker.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10 2H9c-2.828 0-4.243 0-5.121.879C3 3.757 3 5.172 3 8v13.25H2a.75.75 0 0 0 0 1.5h15.25a.75.75 0 0 0 0-1.5H16v-3.5h1.571c.375 0 .679.304.679.679v.071a2.25 2.25 0 1 0 4.5 0V7.602c0-.157 0-.265-.006-.37a3.75 3.75 0 0 0-1.24-2.582a9 9 0 0 0-.286-.236l-1.25-1a.75.75 0 1 0-.936 1.172l1.233.986c.144.116.194.156.237.195c.443.397.711.954.745 1.549a6 6 0 0 1 .003.306V8h-.75A1.5 1.5 0 0 0 19 9.5v2.419a1.5 1.5 0 0 0 1.026 1.423l1.224.408v4.75a.75.75 0 0 1-1.5 0v-.071a2.18 2.18 0 0 0-2.179-2.179H16V8c0-2.828 0-4.243-.879-5.121C14.243 2 12.828 2 10 2m-.114 7.357a.75.75 0 0 1 .257 1.029l-.818 1.364H11a.75.75 0 0 1 .643 1.136l-1.5 2.5a.75.75 0 1 1-1.286-.772l.818-1.364H8a.75.75 0 0 1-.643-1.136l1.5-2.5a.75.75 0 0 1 1.029-.257" clip-rule="evenodd"/></svg>`;
        stationMarker.style.fontSize = '24px';
        stationMarker.classList.add('text-noir', 'bg-vert', 'rounded-full', 'p-1', 'shadow-md', 'border-2', 'border-bleu', 'hover:shadow-lg', 'transition-shadow', 'duration-200');
    
        new Marker({ element: stationMarker })
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

  // Fonction pour l'automatisation de la recherche
  onSearchInput(query: string) {

    if (query.trim().length < 3) {
      this.suggestions = [];
      return;
    }

    // Récupérer les coordonnées actuelles de la carte
    const center = this.map?.getCenter();
    if (!center) {
      this.suggestions = [];
      return;
    }
    const { lng, lat } = center;

    // Définir une zone autour de la carte, par exemple un rayon de 50 km
    const bbox = [
      lng - 0.5, lat - 0.5, // Coin inférieur gauche
      lng + 0.5, lat + 0.5  // Coin supérieur droit
    ];
  
    const apiKey = 'GC5T8jKrwWEDcC6F741K';
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${apiKey}&language=fr&country=fr&bbox=${bbox.join(',')}`;
  
    // Requête API
    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.suggestions = data.features || [];  // Récupération des suggestions
      })
      .catch(err => console.error('Erreur géocodage :', err));
  }
  
  // Fonction pour gérer la sélection d'une suggestion
  selectSuggestion(index: number) {
    const feature = this.suggestions[index];
    if (!feature) return;
  
    const [lng, lat] = feature.geometry.coordinates;
  
    // Centrer la carte sur les coordonnées sélectionnées
    this.map?.flyTo({ center: [lng, lat], zoom: 15 });
  
    // Ajouter un marqueur si nécessaire
    // const marker = new Marker().setLngLat([lng, lat]).addTo(this.map);
  
    // Remplir le champ de saisie avec le lieu sélectionné
    this.searchQuery = feature.place_name;
    
    // Vider la liste des suggestions après sélection
    this.suggestions = [];
  
    console.log('📍 Coordonnées sélectionnées :', { lat, lng });
  }



  ngOnDestroy() {
    this.map?.remove();
    this.subscription?.unsubscribe();
  }


}
