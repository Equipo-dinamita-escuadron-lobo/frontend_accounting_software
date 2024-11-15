import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdExportComponent } from './third-export.component';

describe('AccountExportComponent', () => {
  let component: ThirdExportComponent;
  let fixture: ComponentFixture<ThirdExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdExportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
