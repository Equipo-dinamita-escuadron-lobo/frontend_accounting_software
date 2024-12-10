import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountImportComponent } from './account-import.component';

/**
 * Pruebas unitarias para el componente AccountImportComponent.
 */
describe('AccountImportComponent', () => {
  let component: AccountImportComponent;
  let fixture: ComponentFixture<AccountImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountImportComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AccountImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
