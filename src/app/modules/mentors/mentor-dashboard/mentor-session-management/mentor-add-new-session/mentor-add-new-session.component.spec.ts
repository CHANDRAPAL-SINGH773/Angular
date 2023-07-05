import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorAddNewSessionComponent } from './mentor-add-new-session.component';

describe('MentorAddNewSessionComponent', () => {
  let component: MentorAddNewSessionComponent;
  let fixture: ComponentFixture<MentorAddNewSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorAddNewSessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorAddNewSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
