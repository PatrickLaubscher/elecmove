import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StationException } from '../../shared/entities';
import { StationExceptionCreationDTO } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class StationExceptionService {

  private readonly http = inject(HttpClient);

  getOne(id: string) {
    return this.http.get<StationException>(`/api/availabilities/${id}`);
  }

  getAllByStation(stationId: string) {
    return this.http.get<StationException[]>(`/api/availabilities?stationId=${stationId}`);
  }

  add(exception: StationExceptionCreationDTO) {
    return this.http.post<StationException>('/api/availabilities', exception);
  }

  update(id: string, exception: StationExceptionCreationDTO) {
    return this.http.put<StationException>(`/api/availabilities/${id}`, exception);
  }

  delete(id: string) {
    return this.http.delete<void>(`/api/availabilities/${id}`);
  }
}
