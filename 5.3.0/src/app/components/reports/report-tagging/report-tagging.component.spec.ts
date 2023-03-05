import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTaggingComponent } from './report-tagging.component';

describe('ReportTaggingComponent', () => {
  let component: ReportTaggingComponent;
  let fixture: ComponentFixture<ReportTaggingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTaggingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
