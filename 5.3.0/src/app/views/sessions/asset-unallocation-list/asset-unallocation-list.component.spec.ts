import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetUnallocationListComponent } from './asset-unallocation-list.component';

describe('AssetUnallocationListComponent', () => {
  let component: AssetUnallocationListComponent;
  let fixture: ComponentFixture<AssetUnallocationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetUnallocationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetUnallocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
