import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRequestedProgramListComponent } from './admin-requested-program-list.component';

describe('AdminRequestedProgramListComponent', () => {
  let component: AdminRequestedProgramListComponent;
  let fixture: ComponentFixture<AdminRequestedProgramListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRequestedProgramListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRequestedProgramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
