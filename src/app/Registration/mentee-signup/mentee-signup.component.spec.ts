import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenteeSignupComponent } from './mentee-signup.component';

describe('MenteeSignupComponent', () => {
  let component: MenteeSignupComponent;
  let fixture: ComponentFixture<MenteeSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenteeSignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenteeSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
