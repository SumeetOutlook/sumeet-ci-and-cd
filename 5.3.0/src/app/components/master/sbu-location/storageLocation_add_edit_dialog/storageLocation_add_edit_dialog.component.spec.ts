import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageLocationDialogComponent } from './storageLocation_add_edit_dialog.component';

describe('StorageLocationDialogComponent', () => {
  let component: StorageLocationDialogComponent;
  let fixture: ComponentFixture<StorageLocationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageLocationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageLocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
