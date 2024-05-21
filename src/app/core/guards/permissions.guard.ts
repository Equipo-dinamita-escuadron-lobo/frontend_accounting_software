import { CanActivateFn } from '@angular/router';

export const permissionsGuard: CanActivateFn = (route, state) => {
  if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.roles.includes('admin_client') || user.roles.includes('user_client')) {
      return true;
    }
  }
  return false;
};
