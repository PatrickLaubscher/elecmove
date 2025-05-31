import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { NewUser, User } from '../entities';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private headers = new HttpHeaders({
    'Content-Type': 'application/ld+json'
  });

  user:User|undefined;


  addNewUser(newUser: NewUser): Observable<NewUser> {
    return this.http.post<NewUser>(`${this.apiUrl}/users`, newUser, {'headers': this.headers}).pipe(
      catchError((error) => {
        console.error('Erreur lors de la création de votre compte', error);
        return throwError(() => error);
      })
    )
  }


  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    const users = userStr ? JSON.parse(userStr) : null;
    return users ? users[0] : null;
  }


  setUser(user: User): void {
    return localStorage.setItem('user', JSON.stringify([user]));
  }
}
