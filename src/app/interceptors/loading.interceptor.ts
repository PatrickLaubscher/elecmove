import { HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { finalize } from 'rxjs';

const LOADER_DELAY_MS = 300;

export const loadingInterceptor: HttpInterceptorFn = (req, next: HttpHandlerFn) => {

  const loaderService = inject(LoaderService);

  const excludedUrls = ['api.maptiler.com', 'maptiler'];
  const shouldSkipLoader = excludedUrls.some(url => req.url.includes(url));

  if (shouldSkipLoader) {
    return next(req);
  }

  let loaderShown = false;
  const timer = setTimeout(() => {
    loaderShown = true;
    loaderService.show();
  }, LOADER_DELAY_MS);

  return next(req).pipe(
    finalize(() => {
      clearTimeout(timer);
      if (loaderShown) {
        loaderService.hide();
      }
    })
  );
};
