import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

/* tslint:disable no-any */
declare var WifiWizard2: any;
/* tslint:enable no-any */

@Injectable({
  providedIn: 'root'
})
export class RemoteDeviceConnectService {

  constructor() { }

  connect(ssid: string, password: string) {
    return from(WifiWizard2.connect(ssid, true, password)).pipe(
      map(connectionStatus => {
        return connectionStatus === 'NETWORK_CONNECTION_COMPLETED' ? true : false;
      }),
    );
  }
}
