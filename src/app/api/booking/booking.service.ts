import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { Booking, BookingStatus } from '../../shared/entities';
import { BookingCreationDTO } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private readonly http = inject(HttpClient);

  getOne(id:string) {
    return httpResource<Booking>(() => '/api/bookings/' + id);
  }

  add(newBooking:BookingCreationDTO) {
    return this.http.post<Booking>('/api/bookings', newBooking);
  }

  put(id:Signal<number>, booking:BookingCreationDTO) {
    return this.http.put<Booking>('/api/bookings/'+ id(), booking);
  }

  updateStatus(id:Signal<number>, status:BookingStatus) {
    return this.http.patch<null>('/api/bookings/'+ id(), status);
  }

  delete(id:Signal<number>) {
    return this.http.delete<null>('/api/bookings/'+ id());
  }


}
