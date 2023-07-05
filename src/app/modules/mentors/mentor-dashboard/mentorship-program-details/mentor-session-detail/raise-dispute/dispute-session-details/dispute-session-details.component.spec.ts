import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeSessionDetailsComponent } from './dispute-session-details.component';

describe('DisputeSessionDetailsComponent', () => {
  let component: DisputeSessionDetailsComponent;
  let fixture: ComponentFixture<DisputeSessionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisputeSessionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisputeSessionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
