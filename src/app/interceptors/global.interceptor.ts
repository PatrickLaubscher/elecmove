import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment.development';


export const globalInterceptor: HttpInterceptorFn = (req, next) => {

  if(!req.url.startsWith('https://api.maptiler')) {
      const clone = req.clone({
        url: req.url.startsWith('http') ? req.url : environment.serverUrl + req.url,
        withCredentials: req.withCredentials
      })
      return next(clone)
  }

  return next(req);
  
};

