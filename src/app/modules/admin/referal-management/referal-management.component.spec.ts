import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferalManagementComponent } from './referal-management.component';

describe('ReferalManagementComponent', () => {
  let component: ReferalManagementComponent;
  let fixture: ComponentFixture<ReferalManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferalManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferalManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
