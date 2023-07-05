import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatesessionsComponent } from './ratesessions.component';

describe('RatesessionsComponent', () => {
  let component: RatesessionsComponent;
  let fixture: ComponentFixture<RatesessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatesessionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatesessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
