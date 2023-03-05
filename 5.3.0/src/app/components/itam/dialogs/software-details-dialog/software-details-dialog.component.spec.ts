import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareDetailsDialogComponent } from './software-details-dialog.component';

describe('SoftwareDetailsDialogComponent', () => {
  let component: SoftwareDetailsDialogComponent;
  let fixture: ComponentFixture<SoftwareDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwareDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
