import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagMasterDialogComponent } from './add_tag_master_dialog.component';

describe('addUserDialogComponent', () => {
  let component: TagMasterDialogComponent;
  let fixture: ComponentFixture<TagMasterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagMasterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagMasterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
