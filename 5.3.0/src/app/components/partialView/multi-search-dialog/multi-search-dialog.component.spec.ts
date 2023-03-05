import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSearchDialogComponent } from './multi-search-dialog.component';

describe('MultiSearchDialogComponent', () => {
  let component: MultiSearchDialogComponent;
  let fixture: ComponentFixture<MultiSearchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSearchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
