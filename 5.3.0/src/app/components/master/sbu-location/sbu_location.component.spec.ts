import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSbu_Location_Storage_LocationComponent } from './create_sbu_location_storage-location.component';

describe('UserCredentialsComponent', () => {
  let component: CreateSbu_Location_Storage_LocationComponent;
  let fixture: ComponentFixture<CreateSbu_Location_Storage_LocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSbu_Location_Storage_LocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSbu_Location_Storage_LocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
