import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeBankDetailsComponent } from './change-bank-details.component';

describe('ChangeBankDetailsComponent', () => {
  let component: ChangeBankDetailsComponent;
  let fixture: ComponentFixture<ChangeBankDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeBankDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
