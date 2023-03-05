import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbuDialogComponent } from './sbu-dialog.component';

describe('SbuDialogComponent', () => {
  let component: SbuDialogComponent;
  let fixture: ComponentFixture<SbuDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbuDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbuDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
