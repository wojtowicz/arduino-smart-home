import { Injectable, EventEmitter } from '@angular/core';
import { from, of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

import { WIFI_DEVICES } from '../../mocks/mock-wifi-device';

@Injectable({
  providedIn: 'root'
})
export class LocalWifiDeviceSourceService {
  constructor() { }

  scan() {
    return from(WIFI_DEVICES).pipe(delay(2000))
  }

  listenOnNetworkConnect() {
    return new Observable(subscriber => {
      setTimeout(() => {
        subscriber.next();
        subscriber.complete();
      }, 3000);
    });
  }
}
