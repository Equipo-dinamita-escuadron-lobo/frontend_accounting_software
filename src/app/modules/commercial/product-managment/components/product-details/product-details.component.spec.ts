import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsModalComponent } from './product-details.component';

describe('ProductDetailsModalComponent', () => {
  let component: ProductDetailsModalComponent;
  let fixture: ComponentFixture<ProductDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductDetailsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
