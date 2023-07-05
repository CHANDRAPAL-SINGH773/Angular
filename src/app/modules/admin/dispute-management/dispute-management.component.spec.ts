import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeManagementComponent } from './dispute-management.component';

describe('DisputeManagementComponent', () => {
  let component: DisputeManagementComponent;
  let fixture: ComponentFixture<DisputeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisputeManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisputeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
