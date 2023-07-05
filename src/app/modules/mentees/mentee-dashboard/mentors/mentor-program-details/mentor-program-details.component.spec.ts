import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorProgramDetailsComponent } from './mentor-program-details.component';

describe('MentorProgramDetailsComponent', () => {
  let component: MentorProgramDetailsComponent;
  let fixture: ComponentFixture<MentorProgramDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorProgramDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorProgramDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
