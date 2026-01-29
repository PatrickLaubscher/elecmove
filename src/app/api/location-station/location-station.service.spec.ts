import { TestBed } from '@angular/core/testing';

import { LocationStationService } from './location-station.service';

describe('LocationStationService', () => {
  let service: LocationStationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationStationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
