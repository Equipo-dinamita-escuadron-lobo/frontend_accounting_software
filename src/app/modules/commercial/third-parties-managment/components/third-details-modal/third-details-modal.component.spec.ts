import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdDetailsModalComponent } from './third-details-modal.component';

describe('ThirdDetailsModalComponent', () => {
  let component: ThirdDetailsModalComponent;
  let fixture: ComponentFixture<ThirdDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdDetailsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
