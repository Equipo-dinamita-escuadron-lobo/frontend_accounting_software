import { TestBed } from '@angular/core/testing';

import { HelpBoxService } from './help-box.service';

describe('HelpBoxService', () => {
  let service: HelpBoxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelpBoxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
