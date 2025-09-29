import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Station } from '../../shared/entities';

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
    return httpResource<Station[]>(() => '/api/stations');
  }

  getOne(id:string) {
    return httpResource<Station>(() => '/api/stations/' + id);
  }

  getAllNearby(coordinates:CoordinatesWithRadius) {
    return this.http.post<Station[]>('/api/stations/nearby', coordinates);
  }
  
}
