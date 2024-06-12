import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { permissionsSuperGuardTsGuard } from './permissions.super.guard.ts.guard';

describe('permissionsSuperGuardTsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => permissionsSuperGuardTsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
