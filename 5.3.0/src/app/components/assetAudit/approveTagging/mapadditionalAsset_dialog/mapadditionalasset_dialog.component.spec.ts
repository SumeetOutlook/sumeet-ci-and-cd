import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapadditionalassetDialogComponent } from './mapadditionalasset-dialog.component';

describe('Group_dialogComponent', () => {
  let component: MapadditionalassetDialogComponent;
  let fixture: ComponentFixture<MapadditionalassetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapadditionalassetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapadditionalassetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
