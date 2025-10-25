import { TestBed } from '@angular/core/testing';

import { BookingStorageService } from './booking-storage.service';

describe('BookingService', () => {
  let service: BookingStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
