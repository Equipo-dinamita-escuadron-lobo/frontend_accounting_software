import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../../modules/principal/login/services/auth.service';
import { Router } from '@angular/router';
import { UserModalEditComponent } from '../../../modules/users/components/user-modal-edit/user-modal-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageMethods } from '../../methods/local-storage.method';

@Component({
  selector: 'app-header-enterprises',
  templateUrl: './header-enterprises.component.html',
  styleUrl: './header-enterprises.component.css',
})
export class HeaderEnterprisesComponent {
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  rol: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.rol = this.authService.verifiedRolSuperUser();
  }


  logOut() {
    this.authService.logout();
    this.logInUser();
  }

  logInUser() {
    this.router.navigate(['/']);
  }

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.relative')) {
      this.dropdownOpen = false;
    }
  }

  openModalEdit(): void {
    this.openPopUp('Mi perfil', UserModalEditComponent);
  }

  openPopUp(title: any, component: any) {
    var _popUp = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '600ms',
      data: {
        title: title,
      },
    });
    _popUp.afterClosed().subscribe();
  }
}
