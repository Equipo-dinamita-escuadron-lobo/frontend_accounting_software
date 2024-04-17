import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEnterprisesComponent } from './view-enterprises.component';

describe('ViewEnterprisesComponent', () => {
  let component: ViewEnterprisesComponent;
  let fixture: ComponentFixture<ViewEnterprisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewEnterprisesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewEnterprisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
