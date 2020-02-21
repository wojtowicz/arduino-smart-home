import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

import { WIFI_DEVICES } from '../../mocks/mock-wifi-device';
import { WifiDevice } from 'src/app/models/wifi_device';
import { WifiDeviceService } from '../wifi-device.service';

import { Network } from '@ionic-native/network/ngx';
import { WifiNetworkService } from '../device/wifi-network.service';

@Injectable({
  providedIn: 'root'
})
export class LocalWifiDeviceSourceService extends WifiDeviceService {
  constructor(
    public wifiNetworkService: WifiNetworkService
  ) {
    super(wifiNetworkService);
  }

  scan(): Observable<WifiDevice> {
    return from(WIFI_DEVICES).pipe(delay(2000));
  }

  listenOnNetworkConnect(): Observable<void> {
    return new Observable(subscriber => {
      setTimeout(() => {
        subscriber.next();
        subscriber.complete();
      }, 3000);
    });
  }
}
