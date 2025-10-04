import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BookingStatus } from '../../../shared/entities';

@Injectable({
  providedIn: 'root'
})
export class BookingStatusService {

  private readonly http = inject(HttpClient);


  getAll() {
    return httpResource<BookingStatus[]>(() => '/api/booking-status');
  }

  getOne(id:string) {
    return httpResource<BookingStatus>(() => '/api/api/booking-status/' + id);
  }
  
}
