import { TestBed } from '@angular/core/testing';

import { TaxPrayerTypeService } from './tax-prayer-type.service';

describe('TaxPrayerTypeService', () => {
  let service: TaxPrayerTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxPrayerTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
