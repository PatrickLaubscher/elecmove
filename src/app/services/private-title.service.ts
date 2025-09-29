import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrivateTitleService {

  private titleSubject = new BehaviorSubject<string>('Accueil');
  title$ = this.titleSubject.asObservable();

  setTitle(title: string): void {
    this.titleSubject.next(title);
  }
  
}
