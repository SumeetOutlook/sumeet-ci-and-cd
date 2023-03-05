import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSoftwarePageComponent } from './add-software-page.component';

describe('AddSoftwarePageComponent', () => {
  let component: AddSoftwarePageComponent;
  let fixture: ComponentFixture<AddSoftwarePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSoftwarePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSoftwarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
