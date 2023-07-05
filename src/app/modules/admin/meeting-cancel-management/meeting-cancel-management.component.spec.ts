import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingCancelManagementComponent } from './meeting-cancel-management.component';

describe('MeetingCancelManagementComponent', () => {
  let component: MeetingCancelManagementComponent;
  let fixture: ComponentFixture<MeetingCancelManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingCancelManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingCancelManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
