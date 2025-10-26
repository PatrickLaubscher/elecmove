import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeConversionService {

  formatDuration(durationHours: number): string {
    const hours = Math.floor(durationHours); // partie entière = heures
    const minutes = Math.round((durationHours - hours) * 60); // fraction * 60 = minutes
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}min`;
    return result || '0min';
  }
  
}
