import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsListComponent } from './accounts-list.component';

/**
 * Pruebas unitarias para el componente AccountsListComponent.
 */
describe('AccountsListComponent', () => {
  let component: AccountsListComponent;
  let fixture: ComponentFixture<AccountsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
