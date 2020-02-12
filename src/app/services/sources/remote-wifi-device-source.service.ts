import { Injectable } from '@angular/core';

import { Network } from '@ionic-native/network/ngx';

import { from, Observable } from 'rxjs';
import { mergeAll, map } from 'rxjs/operators';
import { WifiDevice, WifiDeviceAdapter, WifiDeviceJson } from 'src/app/models/wifi_device';
import { WifiNetworkService } from '../device/wifi-network.service';
import { WifiDeviceService } from '../wifi-device.service';

/* tslint:disable no-any */
declare var WifiWizard2: any;
/* tslint:enable no-any */

@Injectable({
  providedIn: 'root'
})
export class RemoteWifiDeviceSourceService extends WifiDeviceService {
  constructor(
    public network: Network,
    public wifiNetworkService: WifiNetworkService
  ) {
    super(wifiNetworkService);
  }

  scan(): Observable<WifiDevice> {
    return from(WifiWizard2.scan()).pipe(
      mergeAll(),
      map((json: WifiDeviceJson) => WifiDeviceAdapter(json))
    );
  }

  listenOnNetworkConnect(): Observable<void> {
    return new Observable(subscriber => {
      const connectSubscription = this.network.onConnect().subscribe(() => {
        setTimeout(() => {
          connectSubscription.unsubscribe();
          subscriber.next();
          subscriber.complete();
        }, 3000);
      });
    });
  }
}
