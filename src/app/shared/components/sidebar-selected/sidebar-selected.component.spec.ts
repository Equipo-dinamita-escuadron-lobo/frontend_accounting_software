import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSelectedComponent } from './sidebar-selected.component';

describe('SidebarSelectedComponent', () => {
  let component: SidebarSelectedComponent;
  let fixture: ComponentFixture<SidebarSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarSelectedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
