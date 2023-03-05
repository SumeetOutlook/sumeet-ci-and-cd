import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationMappingDialogComponent } from './automation-mapping-dialog.component';

describe('AutomationMappingDialogComponent', () => {
  let component: AutomationMappingDialogComponent;
  let fixture: ComponentFixture<AutomationMappingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomationMappingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomationMappingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
