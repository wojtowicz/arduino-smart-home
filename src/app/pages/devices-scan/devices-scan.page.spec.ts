import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DevicesScanPage } from './devices-scan.page';

describe('DevicesScanPage', () => {
  let component: DevicesScanPage;
  let fixture: ComponentFixture<DevicesScanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicesScanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DevicesScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
