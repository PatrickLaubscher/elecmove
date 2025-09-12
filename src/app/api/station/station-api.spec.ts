import { TestBed } from '@angular/core/testing';

import { StationApi } from './station-api';

describe('ApiStation', () => {
  let service:StationApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StationApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
