import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorSessionDetailComponent } from './mentor-session-detail.component';

describe('MentorSessionDetailComponent', () => {
  let component: MentorSessionDetailComponent;
  let fixture: ComponentFixture<MentorSessionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorSessionDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorSessionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
