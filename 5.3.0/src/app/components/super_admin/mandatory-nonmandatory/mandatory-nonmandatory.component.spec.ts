import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoryNonmandatoryComponent } from './mandatory-nonmandatory.component';

describe('MandatoryNonmandatoryComponent', () => {
  let component: MandatoryNonmandatoryComponent;
  let fixture: ComponentFixture<MandatoryNonmandatoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatoryNonmandatoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryNonmandatoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
