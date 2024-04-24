import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseEditComponent } from './enterprise-edit.component';

describe('EnterpriseEditComponent', () => {
  let component: EnterpriseEditComponent;
  let fixture: ComponentFixture<EnterpriseEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnterpriseEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnterpriseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
