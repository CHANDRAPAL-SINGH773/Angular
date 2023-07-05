import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorEditNewSessionComponent } from './mentor-edit-new-session.component';

describe('MentorEditNewSessionComponent', () => {
  let component: MentorEditNewSessionComponent;
  let fixture: ComponentFixture<MentorEditNewSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorEditNewSessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorEditNewSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
