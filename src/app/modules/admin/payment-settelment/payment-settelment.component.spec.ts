import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSettelmentComponent } from './payment-settelment.component';

describe('PaymentSettelmentComponent', () => {
  let component: PaymentSettelmentComponent;
  let fixture: ComponentFixture<PaymentSettelmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentSettelmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSettelmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
