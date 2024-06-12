import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModalCreateComponent } from './user-modal-create.component';

describe('UserModalCreateComponent', () => {
  let component: UserModalCreateComponent;
  let fixture: ComponentFixture<UserModalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserModalCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserModalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
