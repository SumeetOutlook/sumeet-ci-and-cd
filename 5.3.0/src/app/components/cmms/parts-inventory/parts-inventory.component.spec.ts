import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsInventoryComponent } from './parts-inventory.component';

describe('PartsInventoryComponent', () => {
  let component: PartsInventoryComponent;
  let fixture: ComponentFixture<PartsInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartsInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartsInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
