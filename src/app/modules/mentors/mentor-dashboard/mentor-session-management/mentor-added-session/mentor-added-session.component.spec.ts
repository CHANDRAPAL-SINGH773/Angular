import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorAddedSessionComponent } from './mentor-added-session.component';

describe('MentorAddedSessionComponent', () => {
  let component: MentorAddedSessionComponent;
  let fixture: ComponentFixture<MentorAddedSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorAddedSessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorAddedSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
