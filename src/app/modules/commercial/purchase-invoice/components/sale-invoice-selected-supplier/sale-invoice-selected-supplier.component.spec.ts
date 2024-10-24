import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleInvoiceSelectedSupplierComponent } from './sale-invoice-selected-supplier.component';

describe('SaleInvoiceSelectedSupplierComponent', () => {
  let component: SaleInvoiceSelectedSupplierComponent;
  let fixture: ComponentFixture<SaleInvoiceSelectedSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleInvoiceSelectedSupplierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaleInvoiceSelectedSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
