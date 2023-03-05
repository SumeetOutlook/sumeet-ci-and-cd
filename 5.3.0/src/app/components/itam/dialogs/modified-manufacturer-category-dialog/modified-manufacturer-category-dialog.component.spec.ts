import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifiedManufacturerCategoryDialogComponent } from './modified-manufacturer-category-dialog.component';

describe('ModifiedManufacturerCategoryDialogComponent', () => {
  let component: ModifiedManufacturerCategoryDialogComponent;
  let fixture: ComponentFixture<ModifiedManufacturerCategoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifiedManufacturerCategoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifiedManufacturerCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
