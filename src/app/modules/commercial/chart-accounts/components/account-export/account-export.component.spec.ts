import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountExportComponent } from './account-export.component';

/**
 * Pruebas unitarias para el componente AccountExportComponent.
 */
describe('AccountExportComponent', () => {
  let component: AccountExportComponent;
  let fixture: ComponentFixture<AccountExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountExportComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AccountExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
