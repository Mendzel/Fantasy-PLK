import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayoffScorePageComponent } from './playoff-score-page.component';

describe('PlayoffScorePageComponent', () => {
  let component: PlayoffScorePageComponent;
  let fixture: ComponentFixture<PlayoffScorePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayoffScorePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayoffScorePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
