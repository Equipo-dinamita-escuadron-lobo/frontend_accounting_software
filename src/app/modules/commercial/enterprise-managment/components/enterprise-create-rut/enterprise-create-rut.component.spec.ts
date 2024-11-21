import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseCreateRUTComponent } from './enterprise-create-rut.component';

describe('EnterpriseCreateRUTComponent', () => {
  let component: EnterpriseCreateRUTComponent;
  let fixture: ComponentFixture<EnterpriseCreateRUTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnterpriseCreateRUTComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnterpriseCreateRUTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
