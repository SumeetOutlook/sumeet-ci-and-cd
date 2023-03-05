import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSoftareInventoryComponent } from './create-softare-inventory.component';

describe('CreateSoftareInventoryComponent', () => {
  let component: CreateSoftareInventoryComponent;
  let fixture: ComponentFixture<CreateSoftareInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSoftareInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSoftareInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
