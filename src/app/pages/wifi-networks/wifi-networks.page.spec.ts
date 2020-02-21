import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WifiNetworksPage } from './wifi-networks.page';

describe('WifiNetworksPage', () => {
  let component: WifiNetworksPage;
  let fixture: ComponentFixture<WifiNetworksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WifiNetworksPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WifiNetworksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
