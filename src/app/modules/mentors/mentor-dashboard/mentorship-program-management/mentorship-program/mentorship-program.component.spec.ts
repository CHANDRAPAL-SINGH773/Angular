import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorshipProgramComponent } from './mentorship-program.component';

describe('MentorshipProgramComponent', () => {
  let component: MentorshipProgramComponent;
  let fixture: ComponentFixture<MentorshipProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorshipProgramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorshipProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
