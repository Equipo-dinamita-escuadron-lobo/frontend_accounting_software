import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCreationComponent } from './product-creation.component';

describe('ProductCreationComponent', () => {
  let component: ProductCreationComponent;
  let fixture: ComponentFixture<ProductCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
