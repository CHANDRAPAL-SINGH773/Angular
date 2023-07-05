import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMeetingCancelationComponent } from './admin-meeting-cancelation.component';

describe('AdminMeetingCancelationComponent', () => {
  let component: AdminMeetingCancelationComponent;
  let fixture: ComponentFixture<AdminMeetingCancelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMeetingCancelationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMeetingCancelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
