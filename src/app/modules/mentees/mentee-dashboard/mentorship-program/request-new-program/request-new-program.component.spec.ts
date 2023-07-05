import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestNewProgramComponent } from './request-new-program.component';

describe('RequestNewProgramComponent', () => {
  let component: RequestNewProgramComponent;
  let fixture: ComponentFixture<RequestNewProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestNewProgramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestNewProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
