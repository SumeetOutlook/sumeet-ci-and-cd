import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationListDialogComponent } from './location-list-dialog.component';

describe('LocationListDialogComponent', () => {
  let component: LocationListDialogComponent;
  let fixture: ComponentFixture<LocationListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
