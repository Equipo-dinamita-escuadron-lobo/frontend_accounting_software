import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdCreatePdfRUTComponent } from './third-create-pdf-rut.component';

describe('ThirdCreatePdfRUTComponent', () => {
  let component: ThirdCreatePdfRUTComponent;
  let fixture: ComponentFixture<ThirdCreatePdfRUTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdCreatePdfRUTComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdCreatePdfRUTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
