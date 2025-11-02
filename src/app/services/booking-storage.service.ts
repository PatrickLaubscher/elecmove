import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingStorageService {
  

  addBookingDate(date:string):void {
    sessionStorage.setItem('bookingDate', JSON.stringify(date));
  }
  
  addBookingStartTime(startTime:string):void {
    sessionStorage.setItem('bookingStartTime', JSON.stringify(startTime));
  }

  addBookingEndTime(endTime:string):void {
    sessionStorage.setItem('bookingEndTime', JSON.stringify(endTime));
  }

  addCarId(id:string):void {
    sessionStorage.setItem('carId', JSON.stringify(id));
  }

  

  getBookingDate(): string | null {
    const date = sessionStorage.getItem('bookingDate');
    return date ? JSON.parse(date) : null;
  }

  getBookingStartTime(): string | null {
    const startTime = sessionStorage.getItem('bookingStartTime');
    return startTime ? JSON.parse(startTime) : null;
  }

  getBookingEndTime(): string | null {
    const endTime = sessionStorage.getItem('bookingEndTime');
    return endTime ? JSON.parse(endTime) : null;
  }

  getCarId(): string | null {
    const carId = sessionStorage.getItem('carId');
    return carId ? JSON.parse(carId) : null;
  }


  clearBooking(): void {
    sessionStorage.removeItem('bookingDate');
    sessionStorage.removeItem('bookingStartTime');
    sessionStorage.removeItem('bookingEndTime');
    sessionStorage.removeItem('carId');
  }
  
}
