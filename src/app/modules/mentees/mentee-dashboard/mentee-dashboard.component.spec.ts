import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenteeDashboardComponent } from './mentee-dashboard.component';

describe('MenteeDashboardComponent', () => {
  let component: MenteeDashboardComponent;
  let fixture: ComponentFixture<MenteeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenteeDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenteeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
