import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostOnSocialMediaComponent } from './post-on-social-media.component';

describe('PostOnSocialMediaComponent', () => {
  let component: PostOnSocialMediaComponent;
  let fixture: ComponentFixture<PostOnSocialMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostOnSocialMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostOnSocialMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
