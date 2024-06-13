import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSelectSupplierComponent } from './invoice-select-supplier.component';

describe('InvoiceSelectSupplierComponent', () => {
  let component: InvoiceSelectSupplierComponent;
  let fixture: ComponentFixture<InvoiceSelectSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceSelectSupplierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoiceSelectSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
