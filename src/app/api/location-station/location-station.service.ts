import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { Location, LocationStation } from '../../shared/entities';


@Injectable({
  providedIn: 'root'
})
export class LocationStationService {
    
  private readonly http = inject(HttpClient);

  getOne(id:string) {
    return httpResource<LocationStation>(() => '/api/locations/' + id);
  }

  add(newLocation:Location) {
    return this.http.post<LocationStation>('/api/locations', newLocation);
  }

  put(id:Signal<number>, location:Location) {
    return this.http.put<LocationStation>('/api/locations/'+ id(), location);
  }

  delete(id:Signal<number>) {
    return this.http.delete<null>('/api/locations/'+ id());
  }


  
}
