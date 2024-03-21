import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdsListComponent } from './thirds-list.component';

describe('ThirdsListComponent', () => {
  let component: ThirdsListComponent;
  let fixture: ComponentFixture<ThirdsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
