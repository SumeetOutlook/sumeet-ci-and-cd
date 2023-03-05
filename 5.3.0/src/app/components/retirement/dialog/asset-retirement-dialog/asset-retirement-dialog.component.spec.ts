import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetRetirementDialogComponent } from './asset-retirement-dialog.component';

describe('AssetRetirementDialogComponent', () => {
  let component: AssetRetirementDialogComponent;
  let fixture: ComponentFixture<AssetRetirementDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetRetirementDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetRetirementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
