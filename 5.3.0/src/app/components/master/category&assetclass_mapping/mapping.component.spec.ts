import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {  CategoryAssetclassMapComponent } from './mapping.component'; 

describe(' CategoryAssetclassMapComponent', () => {
  let component:  CategoryAssetclassMapComponent;
  let fixture: ComponentFixture< CategoryAssetclassMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [  CategoryAssetclassMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( CategoryAssetclassMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
