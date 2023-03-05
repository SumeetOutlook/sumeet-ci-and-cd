import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsInventoryDialogComponent } from './parts-inventory-dialog.component';

describe('PartsInventoryDialogComponent', () => {
  let component: PartsInventoryDialogComponent;
  let fixture: ComponentFixture<PartsInventoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartsInventoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartsInventoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
