import { CanActivateFn } from '@angular/router';

export const permissionsGuard: CanActivateFn = (route, state) => {
  if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.roles.includes('admin_realm') || user.roles.includes('user_realm') || user.roles.includes('super_realm')) {
      return true;
    }
  }
  return false;
};
