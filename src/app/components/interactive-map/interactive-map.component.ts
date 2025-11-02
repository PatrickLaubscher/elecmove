import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener, OnDestroy, inject, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { Map, MapStyle, Marker, Popup } from '@maptiler/sdk';
import * as maptilersdk from '@maptiler/sdk';

import "@maptiler/sdk/dist/maptiler-sdk.css";
import { StationService } from '../../api/station/station.service';
import { Router } from '@angular/router';
import { Location, MapTilerSuggestion } from '../../shared/entities';
import { BookingStorageService } from '../../services/booking-storage.service';


@Component({
  selector: 'app-interactive-map',
  imports: [NgClass, FormsModule],
  templateUrl: './interactive-map.component.html',
  styleUrl: './interactive-map.component.css'
})

export class InteractiveMapComponent implements OnInit, AfterViewInit, OnDestroy {

  protected readonly stationApi = inject(StationService);
  protected readonly router = inject(Router);
  protected readonly bookingStorageService = inject(BookingStorageService);

  protected map: Map | undefined;
  protected isHybrid = false;
  protected isDark = false;
  protected positionMarker: Marker | null = null

  isMapModalOpen = input<boolean>();
  closingModal = output<boolean>();

  readonly form = input<FormGroup>();
  readonly addressSelected = output<Location>();

  searchQuery = '';
  suggestions: MapTilerSuggestion[] = [];
  bookingDate: string = new Date().toISOString().split('T')[0];
  bookingStartTime = '09:00';
  bookingEndTime = '18:00';

  @ViewChild('map')
  protected readonly mapContainer!: ElementRef<HTMLElement>;
  @ViewChild('searchContainer') 
  protected readonly searchContainer!: ElementRef;

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    // Si le clic n’est pas dans la zone de recherche, on vide les suggestions
    if (this.searchContainer && !this.searchContainer.nativeElement.contains(targetElement)) {
      this.suggestions = [];
    }
  }

  ngOnInit(): void {
    maptilersdk.config.apiKey = 'GC5T8jKrwWEDcC6F741K';

    if(document.documentElement.classList.contains('dark')) {
      this.isDark = true;
    }

  }

  addPositionMarker(lng: number, lat: number) {
    if (this.positionMarker) {
      this.positionMarker.remove();
    }
  
    /*const el = document.createElement('div');
    el.innerHTML = `<svg ... ></svg>`; // ton SVG ici
    el.style.fontSize = '24px';
    el.classList.add(/* tes classes Tailwind );*/

    this.positionMarker = new maptilersdk.Marker({
      color: "#FFFFFF"
    })
    .setLngLat([lng, lat])
    .addTo(this.map!);

  }


  ngAfterViewInit():void {

    this.map = new maptilersdk.Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      language: 'fr',
      //center: [initialState.lng, initialState.lat],
      //zoom: initialState.zoom,
      zoom: 14,
      geolocate: true,
      geolocateControl: true,
      maxBounds: [
        [-5.2, 41.3], 
        [9.7, 51.1] 
      ]
    });

    this.map.on('load', () => {
      const center = this.map?.getCenter();
      if (!center) {
        this.suggestions = [];
        return;
      }
      const { lng, lat } = center;

      this.addPositionMarker(lng, lat);

    });
    
    // Ajout d'un boutoon de mode sombre 
    const btnDarkMode = document.createElement('button');
    btnDarkMode.innerText = '🌓';
    btnDarkMode.style.cssText = `
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

    // Ajout d'un boutoon de mode hybride (vue satellite avec mentions sur la carte)
    const btnHybridMode = document.createElement('button');
    btnHybridMode.innerText = '🛰️';
    btnHybridMode.style.cssText = `
      border: none;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    `;

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
        onRemove: () => controlContainer,
      },
      'top-right'
    );
    
    const stationMarker = document.createElement('div');
    stationMarker.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10 2H9c-2.828 0-4.243 0-5.121.879C3 3.757 3 5.172 3 8v13.25H2a.75.75 0 0 0 0 1.5h15.25a.75.75 0 0 0 0-1.5H16v-3.5h1.571c.375 0 .679.304.679.679v.071a2.25 2.25 0 1 0 4.5 0V7.602c0-.157 0-.265-.006-.37a3.75 3.75 0 0 0-1.24-2.582a9 9 0 0 0-.286-.236l-1.25-1a.75.75 0 1 0-.936 1.172l1.233.986c.144.116.194.156.237.195c.443.397.711.954.745 1.549a6 6 0 0 1 .003.306V8h-.75A1.5 1.5 0 0 0 19 9.5v2.419a1.5 1.5 0 0 0 1.026 1.423l1.224.408v4.75a.75.75 0 0 1-1.5 0v-.071a2.18 2.18 0 0 0-2.179-2.179H16V8c0-2.828 0-4.243-.879-5.121C14.243 2 12.828 2 10 2m-.114 7.357a.75.75 0 0 1 .257 1.029l-.818 1.364H11a.75.75 0 0 1 .643 1.136l-1.5 2.5a.75.75 0 1 1-1.286-.772l.818-1.364H8a.75.75 0 0 1-.643-1.136l1.5-2.5a.75.75 0 0 1 1.029-.257" clip-rule="evenodd"/></svg>`; 
    stationMarker.style.fontSize = '24px';
    stationMarker.classList.add('text-noir', 'bg-vert', 'rounded-full', 'p-1', 'shadow-md', 'border-2', 'border-rouge', 'hover:shadow-2xl', 'hover:-translate-y-0.5', 'transition-all', 'delay-300', 'cursor-pointer', 'duration-300', 'ease-in-out');


    new Marker({element: stationMarker})
    .setLngLat([4.850000,45.760000])
    .setPopup(new Popup().setHTML(
      '<h1>Borne 1</h1>'
      + '<p>Adresse : 1 rue de la République</p>'
      + '<p>Type : Borne de recharge</p>'
      + '<p>Réservée de 10h jusqu\'à 14h</p>'
    ))
    .addTo(this.map);

    this.stationApi.getAllNearby({
      latitude: 45.7578,
      longitude: 4.8320,
      rayonMeters: 5000
    }).subscribe((stations) => {
      stations.forEach((station) => {
        const stationMarker = document.createElement('div');
        stationMarker.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10 2H9c-2.828 0-4.243 0-5.121.879C3 3.757 3 5.172 3 8v13.25H2a.75.75 0 0 0 0 1.5h15.25a.75.75 0 0 0 0-1.5H16v-3.5h1.571c.375 0 .679.304.679.679v.071a2.25 2.25 0 1 0 4.5 0V7.602c0-.157 0-.265-.006-.37a3.75 3.75 0 0 0-1.24-2.582a9 9 0 0 0-.286-.236l-1.25-1a.75.75 0 1 0-.936 1.172l1.233.986c.144.116.194.156.237.195c.443.397.711.954.745 1.549a6 6 0 0 1 .003.306V8h-.75A1.5 1.5 0 0 0 19 9.5v2.419a1.5 1.5 0 0 0 1.026 1.423l1.224.408v4.75a.75.75 0 0 1-1.5 0v-.071a2.18 2.18 0 0 0-2.179-2.179H16V8c0-2.828 0-4.243-.879-5.121C14.243 2 12.828 2 10 2m-.114 7.357a.75.75 0 0 1 .257 1.029l-.818 1.364H11a.75.75 0 0 1 .643 1.136l-1.5 2.5a.75.75 0 1 1-1.286-.772l.818-1.364H8a.75.75 0 0 1-.643-1.136l1.5-2.5a.75.75 0 0 1 1.029-.257" clip-rule="evenodd"/></svg>`;
        stationMarker.style.fontSize = '24px';
        stationMarker.classList.add(
          'text-noir', 'bg-vert', 'rounded-full', 'p-1', 'shadow-md',
          'border-2', 'border-bleu', 'hover:shadow-2xl', 'hover:-translate-y-0.5',
          'transition-all', 'delay-300', 'cursor-pointer', 'duration-300', 'ease-in-out'
        );

        const popup = new Popup().setHTML(`
          <h1>Borne</h1>
          <p>Adresse : ${station.location.address}</p>
          <p>Type : ${station.type}</p>
          <a class="bookingLink cursor-pointer hover:text-vert">Réserver</a>
        `);

        new Marker({ element: stationMarker })
          .setLngLat([station.location.longitude, station.location.latitude]) 
          .setPopup(popup)
          .addTo(this.map!);

        popup.on('open', () => {
          const link = popup.getElement().querySelector('.bookingLink');
          if (link) {
            link.addEventListener('click', () => {

              this.bookingStorageService.addBookingDate(this.bookingDate);
              this.bookingStorageService.addBookingStartTime(this.bookingStartTime);
              this.bookingStorageService.addBookingEndTime(this.bookingEndTime);

              if(this.isMapModalOpen() === true) {
                this.closingModal.emit(false);
              } 
              
              this.router.navigate(['/private/bookings'], {queryParams: {stationId: station.id} });
            });
          }
        });
          
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
        this.suggestions = data.features || []; 
      })
      .catch(err => console.error('Erreur géocodage :', err));
  }
  
  // Fonction pour gérer la sélection d'une suggestion
  selectSuggestion(index: number) {
    const feature = this.suggestions[index];
    if (!feature) return;
    
    
    // Select fields from response Api before patch with form value
    const [lng, lat] = feature.geometry.coordinates;
    
    const context = feature.context ?? [];
    const placeName = feature.place_name;

    const number = feature.address ?? '';
    const street = feature.text ?? '';
    const city = context.find((c) => c.id.startsWith('municipality'))?.text ?? '';
    const postcode = context.find((c) => c.id.startsWith('postal_code'))?.text ?? '';
    
    if(this.form()){
      this.form()?.patchValue({
            address: placeName
      });
    }

    // Centrer la carte sur les coordonnées sélectionnées
    this.map?.flyTo({ center: [lng, lat], zoom: 15 });

    this.addPositionMarker(lng, lat);

    // Send datas to parent element
    this.addressSelected.emit({
      address: number + ' ' + street,
      city,
      zipcode: postcode,
      latitude: Number.parseFloat(lat.toFixed(6)),
      longitude: Number.parseFloat(lng.toFixed(6))
    });
  
    // Ajouter un marqueur si nécessaire
    // const marker = new Marker().setLngLat([lng, lat]).addTo(this.map);
  
    // Remplir le champ de saisie avec le lieu sélectionné
    this.searchQuery = this.suggestions[index].place_name;
    
    // Vider la liste des suggestions après sélection
    this.suggestions = [];
  }

  // Fonction pour gérer l'apparition des dates et heures de réservation
  get showInputs(): boolean {
    return this.searchQuery.trim().length > 0;
  }

  ngOnDestroy() {
    this.map?.remove();
  }


}
