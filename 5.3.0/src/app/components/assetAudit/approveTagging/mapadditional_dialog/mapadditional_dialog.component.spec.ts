import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapadditionalDialogComponent } from './mapadditional-dialog.component';

describe('Group_dialogComponent', () => {
  let component: MapadditionalDialogComponent;
  let fixture: ComponentFixture<MapadditionalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapadditionalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapadditionalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
