import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatedAssetDialogComponent } from './allocated-asset-dialog.component';

describe('AllocatedAssetDialogComponent', () => {
  let component: AllocatedAssetDialogComponent;
  let fixture: ComponentFixture<AllocatedAssetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocatedAssetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocatedAssetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
