import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderEnterprisesComponent } from './header-enterprises.component';

describe('HeaderEnterprisesComponent', () => {
  let component: HeaderEnterprisesComponent;
  let fixture: ComponentFixture<HeaderEnterprisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderEnterprisesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderEnterprisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
