import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseCreationComponent } from './enterprise-creation.component';

describe('EnterpriseCreationComponent', () => {
  let component: EnterpriseCreationComponent;
  let fixture: ComponentFixture<EnterpriseCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnterpriseCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnterpriseCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
