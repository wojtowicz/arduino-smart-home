import { Injectable } from '@angular/core';

import { Network } from '@ionic-native/network/ngx';

import { from, Observable } from 'rxjs';
import { mergeAll } from 'rxjs/operators';
import { WifiDevice } from 'src/app/models/wifi_device';

/* tslint:disable no-any */
declare var WifiWizard2: any;
/* tslint:enable no-any */

@Injectable({
  providedIn: 'root'
})
export class RemoteWifiDeviceSourceService {
  constructor(private network: Network) { }

  scan(): Observable<WifiDevice> {
    return from(WifiWizard2.scan()).pipe(mergeAll());
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
