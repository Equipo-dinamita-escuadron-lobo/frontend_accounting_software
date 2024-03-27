import { TestBed } from '@angular/core/testing';

import { EnterpriseTypeService } from './enterprise-type.service';

describe('EnterpriseTypeService', () => {
  let service: EnterpriseTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnterpriseTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
