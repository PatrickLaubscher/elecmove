import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { FavoriteStation } from '../../shared/entities';
import { FavoriteStationCreationDTO } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class FavoriteStationService {

  private readonly http = inject(HttpClient);


  getOne(id:string) {
    return httpResource<FavoriteStation>(() => '/api/favorite-stations/' + id);
  }

  getAll() {
    return httpResource<FavoriteStation>(() => '/api/favorite-stations/');
  }

  add(newFavorite:FavoriteStationCreationDTO) {
    return this.http.post<FavoriteStation>('/api/favorite-stations', newFavorite);
  }

  delete(id:Signal<number>) {
    return this.http.delete<null>('/api/favorite-stations/'+ id());
  }
  
}
