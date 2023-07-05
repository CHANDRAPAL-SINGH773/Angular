import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorshipProgramDetailsComponent } from './mentorship-program-details.component';

describe('MentorshipProgramDetailsComponent', () => {
  let component: MentorshipProgramDetailsComponent;
  let fixture: ComponentFixture<MentorshipProgramDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorshipProgramDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorshipProgramDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
