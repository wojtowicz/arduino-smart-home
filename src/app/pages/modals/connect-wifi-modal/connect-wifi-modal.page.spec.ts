import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConnectWifiModalPage } from './connect-wifi-modal.page';

describe('ConnectWifiModalPage', () => {
  let component: ConnectWifiModalPage;
  let fixture: ComponentFixture<ConnectWifiModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectWifiModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectWifiModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
