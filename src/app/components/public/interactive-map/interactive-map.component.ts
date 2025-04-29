import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, MapStyle, config, Marker, Popup } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

@Component({
  selector: 'app-interactive-map',
  imports: [],
  templateUrl: './interactive-map.component.html',
  styleUrl: './interactive-map.component.css'
})

export class InteractiveMapComponent implements OnInit, AfterViewInit, OnDestroy {

  map: Map | undefined;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    config.apiKey = 'GC5T8jKrwWEDcC6F741K';
  }

  ngAfterViewInit() {
    const initialState = { lng: 4.850000, lat: 45.750000, zoom: 14 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });


    new Marker({color: "#FF0000"})
    .setLngLat([4.850000,45.750000])
    .setPopup(new Popup().setHTML("<h1>Borne 1</h1>"))
    .addTo(this.map);

    const iconRed = document.createElement('div');
    iconRed.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10 2H9c-2.828 0-4.243 0-5.121.879C3 3.757 3 5.172 3 8v13.25H2a.75.75 0 0 0 0 1.5h15.25a.75.75 0 0 0 0-1.5H16v-3.5h1.571c.375 0 .679.304.679.679v.071a2.25 2.25 0 1 0 4.5 0V7.602c0-.157 0-.265-.006-.37a3.75 3.75 0 0 0-1.24-2.582a9 9 0 0 0-.286-.236l-1.25-1a.75.75 0 1 0-.936 1.172l1.233.986c.144.116.194.156.237.195c.443.397.711.954.745 1.549a6 6 0 0 1 .003.306V8h-.75A1.5 1.5 0 0 0 19 9.5v2.419a1.5 1.5 0 0 0 1.026 1.423l1.224.408v4.75a.75.75 0 0 1-1.5 0v-.071a2.18 2.18 0 0 0-2.179-2.179H16V8c0-2.828 0-4.243-.879-5.121C14.243 2 12.828 2 10 2m-.114 7.357a.75.75 0 0 1 .257 1.029l-.818 1.364H11a.75.75 0 0 1 .643 1.136l-1.5 2.5a.75.75 0 1 1-1.286-.772l.818-1.364H8a.75.75 0 0 1-.643-1.136l1.5-2.5a.75.75 0 0 1 1.029-.257" clip-rule="evenodd"/></svg>`; 
    iconRed.style.fontSize = '24px';
    iconRed.style.color = 'red';


    new Marker({element: iconRed})
    .setLngLat([4.850000,45.760000])
    .setPopup(new Popup().setHTML(
      "<h1>Borne 1</h1>"
      + "<p>Adresse : 1 rue de la République</p>"
      + "<p>Type : Borne de recharge</p>"
      + "<p>Réservée de 10h jusqu'à 14h</p>"
    ))
    .addTo(this.map);


    for (let i = 0; i < 10; i++) {

      let lat = 45.750000 + (i * (Math.random() * 0.01));
      let lng = 4.850000 + (i * (Math.random() * 0.01));

      const iconBlue = document.createElement('div');
      iconBlue.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10 2H9c-2.828 0-4.243 0-5.121.879C3 3.757 3 5.172 3 8v13.25H2a.75.75 0 0 0 0 1.5h15.25a.75.75 0 0 0 0-1.5H16v-3.5h1.571c.375 0 .679.304.679.679v.071a2.25 2.25 0 1 0 4.5 0V7.602c0-.157 0-.265-.006-.37a3.75 3.75 0 0 0-1.24-2.582a9 9 0 0 0-.286-.236l-1.25-1a.75.75 0 1 0-.936 1.172l1.233.986c.144.116.194.156.237.195c.443.397.711.954.745 1.549a6 6 0 0 1 .003.306V8h-.75A1.5 1.5 0 0 0 19 9.5v2.419a1.5 1.5 0 0 0 1.026 1.423l1.224.408v4.75a.75.75 0 0 1-1.5 0v-.071a2.18 2.18 0 0 0-2.179-2.179H16V8c0-2.828 0-4.243-.879-5.121C14.243 2 12.828 2 10 2m-.114 7.357a.75.75 0 0 1 .257 1.029l-.818 1.364H11a.75.75 0 0 1 .643 1.136l-1.5 2.5a.75.75 0 1 1-1.286-.772l.818-1.364H8a.75.75 0 0 1-.643-1.136l1.5-2.5a.75.75 0 0 1 1.029-.257" clip-rule="evenodd"/></svg>`; 
      iconBlue.style.fontSize = '24px';
      iconBlue.style.color = 'blue';
  
      new Marker({element: iconBlue})
      .setLngLat([lng,lat])
      .setPopup(new Popup().setHTML(
        "<h1>Borne 1</h1>"
        + "<p>Adresse : 1 rue de la République</p>"
        + "<p>Type : Borne de recharge</p>"
        + "<p>Disponibilité : Oui</p>"
      ))
      .addTo(this.map);

    }

  }
    
  ngOnDestroy() {
    this.map?.remove();
  }
  
}
