import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../shared/entities';
import { LoginCredentialsDTO, LoginResponseDTO, UserConnectedDTO, UserCreationDTO } from '../dto';


@Injectable({
  providedIn: 'root'
})

export class AuthentificationService {


  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  private readonly http = inject(HttpClient);

  readonly userLogged = signal<UserConnectedDTO|null>(null);

  constructor() {
    if(this.platformId === 'browser') {
      
      if(localStorage.getItem('user')){
        this.userLogged.set(
          JSON.parse(localStorage.getItem('user') || '{}')
        )
      }
    }
  }

  register(dto:UserCreationDTO) {
    return this.http.post<User>(`/api/account/register`, dto);
  }

  login(dto:LoginCredentialsDTO) {
    return this.http.post<LoginResponseDTO>('/api/login', dto, {withCredentials: true})
      .pipe(
        tap(res => {
          if(res.token) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            this.userLogged.set(res.user);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  refreshToken() {
    return this.http.post<string>('/api/refresh-token', null, {withCredentials: true, responseType: 'text' as 'json'})
      .pipe(
        tap(token => {
          localStorage.setItem('token', token);
        }),
        catchError(err => {
          if(err.status == 401) {
            this.logout();
            this.router.navigate(['login']);
            this.snackBar.open('Votre session a expiré, veuillez vous reconnecter', 'ok', {duration: 5000, verticalPosition:'top'});
          }
          throw err;
        })
      );
  }

  logout() {
    this.userLogged.set(null);
    localStorage.clear();
  }
  
}
