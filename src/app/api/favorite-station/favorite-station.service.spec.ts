import { TestBed } from '@angular/core/testing';

import { FavoriteStationService } from './favorite-station.service';

describe('FavoriteStationService', () => {
  let service: FavoriteStationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteStationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
