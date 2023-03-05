import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFARAssetComponent } from './create-farasset.component';

describe('CreateFARAssetComponent', () => {
  let component: CreateFARAssetComponent;
  let fixture: ComponentFixture<CreateFARAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFARAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFARAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
