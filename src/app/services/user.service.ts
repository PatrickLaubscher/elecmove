import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../shared/entities';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  protected readonly http = inject(HttpClient);

  user:User|undefined;


}
