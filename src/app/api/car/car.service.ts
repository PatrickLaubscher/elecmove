import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { Car } from '../../shared/entities';
import { CarCreationDTO } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private readonly http = inject(HttpClient);

  getAll() {
    return httpResource<Car[]>(() => '/api/cars');
  }

  getOne(id:string) {
    return httpResource<Car>(() => '/api/cars/' + id);
  }

  add(newCar:CarCreationDTO) {
    return this.http.post<Car>('/api/cars', newCar);
  }

  put(id:Signal<number>, Car:CarCreationDTO) {
    return this.http.put<Car>('/api/cars/'+ id(), Car);
  }

  delete(id:Signal<number>) {
    return this.http.delete<null>('/api/cars/'+ id());
  }
  
}
