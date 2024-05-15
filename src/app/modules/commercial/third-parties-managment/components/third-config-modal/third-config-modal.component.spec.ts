import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdConfigModalComponent } from './third-config-modal.component';

describe('ThirdConfigModalComponent', () => {
  let component: ThirdConfigModalComponent;
  let fixture: ComponentFixture<ThirdConfigModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdConfigModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdConfigModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
