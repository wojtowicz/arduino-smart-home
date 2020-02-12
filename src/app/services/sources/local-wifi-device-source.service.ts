import { Injectable, EventEmitter } from '@angular/core';
import { from, of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

import { WIFI_DEVICES } from '../../mocks/mock-wifi-device';
import { WifiDevice } from 'src/app/models/wifi_device';

@Injectable({
  providedIn: 'root'
})
export class LocalWifiDeviceSourceService {
  constructor() { }

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
