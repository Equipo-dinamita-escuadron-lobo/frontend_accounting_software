import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSelectProductsComponent } from './invoice-select-products.component';

describe('InvoiceSelectProductsComponent', () => {
  let component: InvoiceSelectProductsComponent;
  let fixture: ComponentFixture<InvoiceSelectProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceSelectProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoiceSelectProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
