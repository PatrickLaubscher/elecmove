import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Station } from '../../shared/entities';
import { environment } from '../../../environments/environment.developpment';


export interface CoordinatesWithRadius {
    latitude:number;
    longitude:number;
    rayonMeters:number;
}

@Injectable({
  providedIn: 'root'
})
export class StationApi {
  
  private readonly http = inject(HttpClient);

  getAll() {
    return httpResource<Station[]>(() => environment.serverUrl + '/api/stations');
  }

  getOne(id:string) {
    return httpResource<Station>(() => environment.serverUrl + '/api/stations/' + id);
  }

  getAllNearby(coordinates:CoordinatesWithRadius) {
    return this.http.post<Station[]>(environment.serverUrl + '/api/stations/nearby', coordinates);
  }
  
}
