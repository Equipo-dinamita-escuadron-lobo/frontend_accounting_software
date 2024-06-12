import { CanActivateFn } from '@angular/router';

export const permissionsSuperGuardTsGuard: CanActivateFn = (route, state) => {
  if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.roles.includes('super_client')) {
      return true;
    }
  }
  return false;
};
