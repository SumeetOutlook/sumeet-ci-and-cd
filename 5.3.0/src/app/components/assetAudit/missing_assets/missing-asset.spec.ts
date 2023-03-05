import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import{MissingAssetComponent} from './missing-asset.component';


describe('CreateUserComponent', () => {
  let component: MissingAssetComponent;
  let fixture: ComponentFixture<MissingAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
