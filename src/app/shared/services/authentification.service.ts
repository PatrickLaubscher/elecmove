import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Credentials, Token } from '../entities';
import { environment } from '../../../environments/environment.developpment';



@Injectable({
  providedIn: 'root'
})

export class AuthentificationService {

  private apiUrl = environment.apiUrl;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  private isAuthenticated = new BehaviorSubject<boolean>(this.checkIfAuthenticated());
  isAuthenticated$ = this.isAuthenticated.asObservable();
  
  private router = inject(Router);
  private http = inject(HttpClient);



  /**
   * 
   * @param credentials - The credentials to register a new user
   * @returns 
   */
  login(credentials: Credentials): Observable<Token> {
    return this.http
      .post<Token>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token != null) {
            this.isAuthenticated.next(true);
            this.setToken(response.token);
            //this.setRefreshToken(response.refresh_token);
          }
        }),
        catchError((error) => {
          return throwError(() => error);
        }
        )
      )
  }


  /**
   * logout the user by clearing the local storage and updating the authentication state
   * @param credentials - The credentials to register a new user
   * @returns An observable of the created user
   */
  logout():void {
    this.isAuthenticated.next(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.router.navigateByUrl('/');
  }


  /**
   * Sets the token in local storage
   * @param token- The token to set in local storage
   * @returns 
   */
  setToken(token: string):void  {
    return localStorage.setItem('accessToken', token);
  }


  /**
   * Gets the token from local storage
   * @returns The token from local storage or null if it does not exist
   */
  getToken():string | null {
    return localStorage.getItem('accessToken');
  }


  /**
   * Checks if the user is authenticated by checking if the token exists in local storage
   * @returns true if the user is authenticated, false otherwise
  */
  checkIfAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }


}
