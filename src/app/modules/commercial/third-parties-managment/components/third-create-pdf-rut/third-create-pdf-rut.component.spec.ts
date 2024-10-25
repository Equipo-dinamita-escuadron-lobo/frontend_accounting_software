import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdCreatePdfRutComponent } from './third-create-pdf-rut.component';

describe('ThirdCreatePdfRutComponent', () => {
  let component: ThirdCreatePdfRutComponent;
  let fixture: ComponentFixture<ThirdCreatePdfRutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdCreatePdfRutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdCreatePdfRutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
