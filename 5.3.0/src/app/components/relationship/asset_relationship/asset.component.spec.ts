import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetRelationshipComponent } from './asset.component';

describe('UserCredentialsComponent', () => {
  let component: AssetRelationshipComponent;
  let fixture: ComponentFixture<AssetRelationshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetRelationshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
