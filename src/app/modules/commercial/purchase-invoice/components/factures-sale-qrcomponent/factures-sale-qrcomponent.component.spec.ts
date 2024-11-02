import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturesSaleQRComponentComponent } from './factures-sale-qrcomponent.component';

describe('FacturesSaleQRComponentComponent', () => {
  let component: FacturesSaleQRComponentComponent;
  let fixture: ComponentFixture<FacturesSaleQRComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FacturesSaleQRComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacturesSaleQRComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
