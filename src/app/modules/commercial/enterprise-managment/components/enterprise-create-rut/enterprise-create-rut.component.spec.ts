import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseCreateRutComponent } from './enterprise-create-rut.component';

describe('EnterpriseCreateRutComponent', () => {
  let component: EnterpriseCreateRutComponent;
  let fixture: ComponentFixture<EnterpriseCreateRutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnterpriseCreateRutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnterpriseCreateRutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
