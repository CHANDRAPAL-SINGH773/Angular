import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastSessionManagementComponent } from './past-session-management.component';

describe('PastSessionManagementComponent', () => {
  let component: PastSessionManagementComponent;
  let fixture: ComponentFixture<PastSessionManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastSessionManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PastSessionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
