import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredMenteesComponent } from './registered-mentees.component';

describe('RegisteredMenteesComponent', () => {
  let component: RegisteredMenteesComponent;
  let fixture: ComponentFixture<RegisteredMenteesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisteredMenteesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredMenteesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
