import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportFieldsComponent } from './export-fields.component';

describe('ExportFieldsComponent', () => {
  let component: ExportFieldsComponent;
  let fixture: ComponentFixture<ExportFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
