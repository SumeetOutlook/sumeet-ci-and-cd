import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAllocationListComponent } from './asset-allocation-list.component';

describe('AssetAllocationListComponent', () => {
  let component: AssetAllocationListComponent;
  let fixture: ComponentFixture<AssetAllocationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetAllocationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetAllocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
