import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalassetsComponent } from './additionalassets.component';

describe('AdditionalassetsComponent', () => {
  let component: AdditionalassetsComponent;
  let fixture: ComponentFixture<AdditionalassetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalassetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalassetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
