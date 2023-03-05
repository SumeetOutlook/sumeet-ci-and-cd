import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalTaggingAssetsComponent } from './additional-tagging-assets.component';

describe('AdditionalTaggingAssetsComponent', () => {
  let component: AdditionalTaggingAssetsComponent;
  let fixture: ComponentFixture<AdditionalTaggingAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalTaggingAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalTaggingAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
