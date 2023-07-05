import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedProgramComponent } from './requested-program.component';

describe('RequestedProgramComponent', () => {
  let component: RequestedProgramComponent;
  let fixture: ComponentFixture<RequestedProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestedProgramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
