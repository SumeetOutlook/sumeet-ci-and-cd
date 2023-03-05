import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostConfigDialogComponent } from './cost-config-dialog.component';

describe('CostConfigDialogComponent', () => {
  let component: CostConfigDialogComponent;
  let fixture: ComponentFixture<CostConfigDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostConfigDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
