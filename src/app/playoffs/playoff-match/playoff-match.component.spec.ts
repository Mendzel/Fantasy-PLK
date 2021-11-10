import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayoffMatchComponent } from './playoff-match.component';

describe('PlayoffMatchComponent', () => {
  let component: PlayoffMatchComponent;
  let fixture: ComponentFixture<PlayoffMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayoffMatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayoffMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
