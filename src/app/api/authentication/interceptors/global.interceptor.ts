import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../../environments/environment';




export const globalInterceptor: HttpInterceptorFn = (req, next) => {
  const clone = req.clone({
    url: req.url.startsWith('http') ? req.url : environment.serverUrl + req.url
  })
  return next(clone);
};

