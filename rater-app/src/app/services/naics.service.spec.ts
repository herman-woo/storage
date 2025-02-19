import { TestBed } from '@angular/core/testing';

import { NaicsService } from './naics.service';

describe('NaicsService', () => {
  let service: NaicsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NaicsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
