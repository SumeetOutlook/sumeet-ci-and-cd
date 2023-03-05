import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewuploadDocregisterDialogComponent } from './viewupload-docregister-dialog.component';

describe('ViewuploadDocregisterDialogComponent', () => {
  let component: ViewuploadDocregisterDialogComponent;
  let fixture: ComponentFixture<ViewuploadDocregisterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewuploadDocregisterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewuploadDocregisterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
