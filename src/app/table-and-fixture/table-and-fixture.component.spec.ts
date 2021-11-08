import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAndFixtureComponent } from './table-and-fixture.component';

describe('TableAndFixtureComponent', () => {
  let component: TableAndFixtureComponent;
  let fixture: ComponentFixture<TableAndFixtureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableAndFixtureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableAndFixtureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
