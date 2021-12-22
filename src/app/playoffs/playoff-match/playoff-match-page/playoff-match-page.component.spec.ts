import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayoffMatchPageComponent } from './playoff-match-page.component';

describe('PlayoffMatchPageComponent', () => {
  let component: PlayoffMatchPageComponent;
  let fixture: ComponentFixture<PlayoffMatchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayoffMatchPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayoffMatchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
