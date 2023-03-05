import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewModifiedDialogComponent } from './view-modified-dialog.component';

describe('ViewModifiedDialogComponent', () => {
  let component: ViewModifiedDialogComponent;
  let fixture: ComponentFixture<ViewModifiedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewModifiedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewModifiedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
