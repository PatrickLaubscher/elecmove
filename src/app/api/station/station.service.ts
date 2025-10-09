import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { Station } from '../../shared/entities';
import { StationCreationDTO } from '../dto';

export interface CoordinatesWithRadius {
    latitude:number;
    longitude:number;
    rayonMeters:number;
}

@Injectable({
  providedIn: 'root'
})
export class StationService {
  
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

  add(newStation:StationCreationDTO) {
    return this.http.post<Station>('/api/stations', newStation);
  }

  put(id:Signal<number>, station:StationCreationDTO) {
    return this.http.put<Station>('/api/stations/'+ id(), station);
  }

  delete(id:Signal<number>) {
    return this.http.delete<null>('/api/stations/'+ id());
  }

  
}
