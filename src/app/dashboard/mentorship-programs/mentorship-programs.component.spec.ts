import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorshipProgramsComponent } from './mentorship-programs.component';

describe('MentorshipProgramsComponent', () => {
  let component: MentorshipProgramsComponent;
  let fixture: ComponentFixture<MentorshipProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorshipProgramsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorshipProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
