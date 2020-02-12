import { Injectable, EventEmitter } from '@angular/core';

import { Network } from '@ionic-native/network/ngx';

import { from, Observable } from 'rxjs';
import { mergeAll } from 'rxjs/operators';

declare var WifiWizard2: any;

@Injectable({
  providedIn: 'root'
})
export class RemoteWifiDeviceSourceService {
  constructor(private network: Network) { }

  scan() {
    return from(WifiWizard2.scan()).pipe(mergeAll());
  }

  listenOnNetworkConnect() {
    return new Observable(subscriber => {
      let connectSubscription = this.network.onConnect().subscribe(() => {
        setTimeout(() => {
          connectSubscription.unsubscribe();
          subscriber.next();
          subscriber.complete();
        }, 3000);
      });
    });
  }
}
