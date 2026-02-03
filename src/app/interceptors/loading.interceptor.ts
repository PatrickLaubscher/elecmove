import { HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next: HttpHandlerFn) => {

  const loaderService = inject(LoaderService);

  const excludedUrls = ['api.maptiler.com', 'maptiler'];
  const shouldSkipLoader = excludedUrls.some(url => req.url.includes(url));

  if (shouldSkipLoader) {
    return next(req);
  }

  loaderService.show();

  return next(req).pipe(
    finalize(() => {
      loaderService.hide();
    })
  );
};
