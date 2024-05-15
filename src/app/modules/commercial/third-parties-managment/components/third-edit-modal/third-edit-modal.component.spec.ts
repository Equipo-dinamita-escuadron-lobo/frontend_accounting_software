import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdEditModalComponent } from './third-edit-modal.component';

describe('ThirdEditModalComponent', () => {
  let component: ThirdEditModalComponent;
  let fixture: ComponentFixture<ThirdEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdEditModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
