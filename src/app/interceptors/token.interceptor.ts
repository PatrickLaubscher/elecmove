import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { catchError, concatMap } from 'rxjs';
import { AuthentificationService } from '../api/authentication/authentification.service';




export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthentificationService);

  const platformId = inject(PLATFORM_ID);
  if(platformId!='browser' || !localStorage.getItem('token') || req.url.includes('refresh-token')) {
    return next(req);
  }

  return next(cloneWithBearer(req)).pipe(
    catchError(err => {
      if(err.status == 403) {
        return auth.refreshToken().pipe(
          concatMap(() => next(cloneWithBearer(req)))
        );
      };
      throw err;
    })
  );
  
};


function cloneWithBearer(req:HttpRequest<unknown>) {
  return req.clone({
    setHeaders: {
      'Authorization' : 'Bearer' + localStorage.getItem('token')
    }
  });
}
