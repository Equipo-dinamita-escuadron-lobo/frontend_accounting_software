import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCreationComponent } from './invoice-creation.component';

describe('InvoiceCreationComponent', () => {
  let component: InvoiceCreationComponent;
  let fixture: ComponentFixture<InvoiceCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoiceCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
