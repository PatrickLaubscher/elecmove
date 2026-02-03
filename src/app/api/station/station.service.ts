import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { PreBookingEstimate, Station } from '../../shared/entities';
import { CoordinatesWithRadiusAndTimeSlotDTO, CoordinatesWithRadiusDTO, PreBookingEstimateResquestDTO, StationCreationDTO } from '../dto';
import { Observable } from 'rxjs';

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

  getOneObservable(id: string): Observable<Station> {
  return this.http.get<Station>(`/api/stations/${id}`);
}

  getAllNearby(coordinates:CoordinatesWithRadiusDTO) {
    return this.http.post<Station[]>('/api/stations/nearby', coordinates);
  }

  getAllAvailableNearby(coordinatesWithTime:CoordinatesWithRadiusAndTimeSlotDTO) {
    return this.http.post<Station[]>('/api/stations/nearby-available', coordinatesWithTime);
  }

  getPrebookingEstimate(id:string, preBookingResquest:PreBookingEstimateResquestDTO) {
    return this.http.post<PreBookingEstimate>(`/api/stations/${id}/prebooking/estimate`, preBookingResquest);
  } 

  add(newStation:StationCreationDTO) {
    return this.http.post<Station>('/api/stations', newStation);
  }

  put(id: string, station:StationCreationDTO) {
    return this.http.put<Station>(`/api/stations/${id}`, station);
  }

  delete(id: string) {
    return this.http.delete<null>(`/api/stations/${id}`);
  }

  
}
