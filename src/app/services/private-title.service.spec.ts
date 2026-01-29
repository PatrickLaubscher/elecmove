import { TestBed } from '@angular/core/testing';

import { PrivateTitleService } from './private-title.service';

describe('PrivateTitleService', () => {
  let service: PrivateTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivateTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
