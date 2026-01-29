import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  readonly isLoading = signal<boolean>(false);

  private requestCount = 0;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private readonly delay = 200; // ms avant d'afficher le loader

  show(): void {
    this.requestCount++;

    if (this.requestCount === 1 && !this.timeoutId) {
      this.timeoutId = setTimeout(() => {
        if (this.requestCount > 0) {
          this.isLoading.set(true);
        }
        this.timeoutId = null;
      }, this.delay);
    }
  }

  hide(): void {
    this.requestCount = Math.max(0, this.requestCount - 1);

    if (this.requestCount === 0) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      this.isLoading.set(false);
    }
  }
}
