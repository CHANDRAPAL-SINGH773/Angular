import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenteeAddedSessionsComponent } from './mentee-added-sessions.component';

describe('MenteeAddedSessionsComponent', () => {
  let component: MenteeAddedSessionsComponent;
  let fixture: ComponentFixture<MenteeAddedSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenteeAddedSessionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenteeAddedSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
