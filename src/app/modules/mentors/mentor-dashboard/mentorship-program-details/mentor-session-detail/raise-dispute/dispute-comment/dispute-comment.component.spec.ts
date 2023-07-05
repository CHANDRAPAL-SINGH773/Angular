import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeCommentComponent } from './dispute-comment.component';

describe('DisputeCommentComponent', () => {
  let component: DisputeCommentComponent;
  let fixture: ComponentFixture<DisputeCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisputeCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisputeCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
