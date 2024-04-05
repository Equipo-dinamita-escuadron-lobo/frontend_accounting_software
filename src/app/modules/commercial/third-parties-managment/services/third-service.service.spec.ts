import { TestBed } from '@angular/core/testing';

import { ThirdServiceService } from './third-service.service';

describe('ThirdServiceService', () => {
  let service: ThirdServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThirdServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
