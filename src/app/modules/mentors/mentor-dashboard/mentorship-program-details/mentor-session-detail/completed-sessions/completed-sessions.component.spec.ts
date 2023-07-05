import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedSessionsComponent } from './completed-sessions.component';

describe('CompletedSessionsComponent', () => {
  let component: CompletedSessionsComponent;
  let fixture: ComponentFixture<CompletedSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedSessionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
