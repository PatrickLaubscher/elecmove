import {  Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Station } from '../entities';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  private http = inject(HttpClient);
  stations = signal<Station[]>([]);
  readonly url = 'markers.json';

  getStation(): Observable<Station[]> {
    return this.http.get<Station[]>(this.url).pipe(
      tap(stations => this.stations.set(stations))
    );
  }
  
}
