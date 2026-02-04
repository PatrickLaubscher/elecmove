import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Picture } from '../../shared/entities';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PictureService {

  private readonly http = inject(HttpClient);

  /**
   * Préfixe les URLs d'images avec l'apiUrl pour qu'elles fonctionnent en production
   */
  private prefixImageUrl(url: string): string {
    if (url && url.startsWith('/') && !url.startsWith('http')) {
      return environment.apiUrl + url;
    }
    return url;
  }

  private transformPicture(picture: Picture): Picture {
    return {
      ...picture,
      src: this.prefixImageUrl(picture.src),
      thumbnail: this.prefixImageUrl(picture.thumbnail)
    };
  }

  getByStation(stationId: string) {
    return this.http.get<Picture[]>(`/api/stations/${stationId}/pictures`).pipe(
      map(pictures => pictures.map(p => this.transformPicture(p)))
    );
  }

  getOne(stationId: string, pictureId: string) {
    return this.http.get<Picture>(`/api/stations/${stationId}/pictures/${pictureId}`).pipe(
      map(picture => this.transformPicture(picture))
    );
  }

  upload(stationId: string, files: File[]) {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    return this.http.post<Picture[]>(`/api/stations/${stationId}/pictures`, formData).pipe(
      map(pictures => pictures.map(p => this.transformPicture(p)))
    );
  }

  delete(stationId: string, pictureId: string) {
    return this.http.delete<void>(`/api/stations/${stationId}/pictures/${pictureId}`);
  }

  setMain(stationId: string, pictureId: string) {
    return this.http.patch<Picture>(`/api/stations/${stationId}/pictures/${pictureId}/main`, {}).pipe(
      map(picture => this.transformPicture(picture))
    );
  }
}
