import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMasterDialogComponent } from './edit_tag_master.component';

describe('editUserDialogComponent', () => {
  let component: EditMasterDialogComponent;
  let fixture: ComponentFixture<EditMasterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMasterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMasterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
