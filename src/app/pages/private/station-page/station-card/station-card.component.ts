import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Picture, Station } from '../../../../shared/entities';
import { PictureService } from '../../../../api/picture/picture.service';

@Component({
  selector: 'app-station-card',
  imports: [],
  templateUrl: './station-card.component.html',
  styleUrl: './station-card.component.css'
})
export class StationCardComponent {

  private readonly pictureService = inject(PictureService);

  readonly station = input.required<Station>();
  readonly editStation = output<Station>();
  readonly deleteStation = output<Station>();

  protected readonly thumbnail = signal<string | null>(null);

  constructor() {
    effect(() => {
      const station = this.station();
      if (station?.id) {
        this.loadThumbnail(station.id);
      }
    });
  }

  private loadThumbnail(stationId: string) {
    this.pictureService.getByStation(stationId).subscribe({
      next: (pictures: Picture[]) => {
        const mainPicture = pictures.find(p => p.main) || pictures[0];
        if (mainPicture) {
          this.thumbnail.set(mainPicture.thumbnail);
        }
      },
      error: () => {
        // Silently fail - no thumbnail available
      }
    });
  }

  onEdit() {
    this.editStation.emit(this.station());
  }

  onDelete() {
    this.deleteStation.emit(this.station());
  }

}
