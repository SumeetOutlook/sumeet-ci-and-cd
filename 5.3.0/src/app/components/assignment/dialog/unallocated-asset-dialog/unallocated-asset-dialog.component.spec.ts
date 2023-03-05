import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnallocatedAssetDialogComponent } from './unallocated-asset-dialog.component';

describe('UnallocatedAssetDialogComponent', () => {
  let component: UnallocatedAssetDialogComponent;
  let fixture: ComponentFixture<UnallocatedAssetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnallocatedAssetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnallocatedAssetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
