import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Picture } from '../../shared/entities';

@Injectable({
  providedIn: 'root'
})
export class PictureService {

  private readonly http = inject(HttpClient);

  getByStation(stationId: string) {
    return this.http.get<Picture[]>(`/api/stations/${stationId}/pictures`);
  }

  getOne(stationId: string, pictureId: string) {
    return this.http.get<Picture>(`/api/stations/${stationId}/pictures/${pictureId}`);
  }

  upload(stationId: string, files: File[]) {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    return this.http.post<Picture[]>(`/api/stations/${stationId}/pictures`, formData);
  }

  delete(stationId: string, pictureId: string) {
    return this.http.delete<void>(`/api/stations/${stationId}/pictures/${pictureId}`);
  }

  setMain(stationId: string, pictureId: string) {
    return this.http.patch<Picture>(`/api/stations/${stationId}/pictures/${pictureId}/main`, {});
  }
}
