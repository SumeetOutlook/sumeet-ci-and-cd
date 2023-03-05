import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MannualMappingDialogComponent } from './mannual-mapping-dialog.component';

describe('MannualMappingDialogComponent', () => {
  let component: MannualMappingDialogComponent;
  let fixture: ComponentFixture<MannualMappingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MannualMappingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MannualMappingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
