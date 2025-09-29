import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../shared/entities';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private headers = new HttpHeaders({
    'Content-Type': 'application/ld+json'
  });

  user:User|undefined;


}
