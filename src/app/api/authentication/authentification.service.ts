import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../shared/entities';
import { LoginCredentialsDTO, LoginResponseDTO, UserConnectedDTO, UserCreationDTO } from './dto';


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
    return this.http.post<User>(`/api/account`, dto);
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
    return this.http.post<{message:string}>('/api/refresh-token', null, {withCredentials: true})
      .pipe(
        tap(res => localStorage.setItem('token', res.message)),
        catchError(err => {
          if(err.status == 403) {
            this.logout();
            this.router.navigate(['register']);
            this.snackBar.open('Your session has expired, please login again', 'ok', {duration: 5000});
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
