import { TestBed } from '@angular/core/testing';

import { TaxLiabilityService } from './tax-liability.service';

describe('TaxLiabilityService', () => {
  let service: TaxLiabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxLiabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
