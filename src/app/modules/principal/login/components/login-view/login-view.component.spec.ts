import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginViewComponent } from './login-view.component';

// Mock para el Router
class RouterStub {
  navigate(commands: any[], extras?: any) { }
}

describe('LoginViewComponent', () => {
  let component: LoginViewComponent;
  let fixture: ComponentFixture<LoginViewComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [LoginViewComponent],
      providers: [
        { provide: Router, useClass: RouterStub }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router); // Inyecta el Router en tu test
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should navigate to "/general/" on login', () => {
  //   const spy = spyOn(router, 'navigate');
  //   component.email = 'test@example.com';
  //   component.password = 'password';
  //   component.login();
  //   expect(spy).toHaveBeenCalledWith(['/general/']);
  // });
});
