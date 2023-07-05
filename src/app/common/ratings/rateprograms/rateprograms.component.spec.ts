import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateprogramsComponent } from './rateprograms.component';

describe('RateprogramsComponent', () => {
  let component: RateprogramsComponent;
  let fixture: ComponentFixture<RateprogramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateprogramsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateprogramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
