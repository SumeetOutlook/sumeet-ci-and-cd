import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetireReinitiateDialogComponent } from './retire-reinitiate-dialog.component';

describe('RetireReinitiateDialogComponent', () => {
  let component: RetireReinitiateDialogComponent;
  let fixture: ComponentFixture<RetireReinitiateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetireReinitiateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetireReinitiateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
