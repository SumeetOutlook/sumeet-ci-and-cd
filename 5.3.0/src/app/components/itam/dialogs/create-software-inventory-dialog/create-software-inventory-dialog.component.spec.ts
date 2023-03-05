import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSoftwareInventoryDialogComponent } from './create-software-inventory-dialog.component';

describe('CreateSoftwareInventoryDialogComponent', () => {
  let component: CreateSoftwareInventoryDialogComponent;
  let fixture: ComponentFixture<CreateSoftwareInventoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSoftwareInventoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSoftwareInventoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
