import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetRetirementListComponent } from './asset-retirement-list.component';

describe('AssetRetirementListComponent', () => {
  let component: AssetRetirementListComponent;
  let fixture: ComponentFixture<AssetRetirementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetRetirementListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetRetirementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
