import { Injectable } from '@angular/core';
import { from } from 'rxjs';
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
}
