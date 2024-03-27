import { TestBed } from '@angular/core/testing';

import { TaxPayerTypeService } from './tax-payer-type.service';

describe('TaxPrayerTypeService', () => {
  let service: TaxPayerTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxPayerTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
