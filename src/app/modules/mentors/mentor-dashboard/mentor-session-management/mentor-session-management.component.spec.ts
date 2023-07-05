import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorSessionManagementComponent } from './mentor-session-management.component';

describe('MentorSessionManagementComponent', () => {
  let component: MentorSessionManagementComponent;
  let fixture: ComponentFixture<MentorSessionManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorSessionManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorSessionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
