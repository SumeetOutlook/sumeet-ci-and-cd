import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSoftwareLicenseComponent } from './edit-software-license.component';

describe('EditSoftwareLicenseComponent', () => {
  let component: EditSoftwareLicenseComponent;
  let fixture: ComponentFixture<EditSoftwareLicenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSoftwareLicenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSoftwareLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
