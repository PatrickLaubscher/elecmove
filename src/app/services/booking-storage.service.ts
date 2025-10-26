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

  clearBooking(): void {
    sessionStorage.removeItem('bookingDate');
    sessionStorage.removeItem('bookingStartTime');
    sessionStorage.removeItem('bookingEndTime');
  }
  
}
