import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { Booking } from '../../shared/entities';
import { BookingCreationDTO } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private readonly http = inject(HttpClient);

  getOne(id:Signal<number>) {
    return httpResource<Booking>(() => '/api/bookings/' + id());
  }

  getAll() {
    return httpResource<Booking[]>(() => '/api/bookings/');
  }

  getAllUpcoming() {
    return httpResource<Booking[]>(() => '/api/bookings/upcoming');
  }

  getAllPast() {
    return httpResource<Booking[]>(() => '/api/bookings/past');
  }

  getAllByStationId(id:Signal<number>) {
    return httpResource<Booking[]>(() => '/api/bookings/station/' + id());
  }

  getAllByStatus(statusId:number) {
    return httpResource<Booking[]>(() => '/api/bookings/status/' + statusId);
  }

  getAllByStationOwnerAndStatus(statusId:number) {
    return httpResource<Booking[]>(() => '/api/bookings/stations/user/status/' + statusId);
  }

  add(newBooking:BookingCreationDTO) {
    return this.http.post<Booking>('/api/bookings', newBooking);
  }

  put(id:Signal<number>, booking:BookingCreationDTO) {
    return this.http.put<Booking>('/api/bookings/'+ id(), booking);
  }

  updateBookingStatus(id:string, statusId:number) {
    return this.http.patch<Booking>(
    '/api/bookings/' + id + '/updateStatus',
    { statusId }, 
    { headers: { 'Content-Type': 'application/json' } }
  );
  }

  delete(id:Signal<number>) {
    return this.http.delete<null>('/api/bookings/'+ id());
  }


}
