import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeviceConnectService } from '../device-connect.service';

/* tslint:disable no-any */
declare var WifiWizard2: any;
/* tslint:enable no-any */

@Injectable({
  providedIn: 'root'
})
export class RemoteDeviceConnectService extends DeviceConnectService {
  connect(ssid: string, password: string): Observable<boolean> {
    return from(WifiWizard2.connect(ssid, true, password)).pipe(
      map(connectionStatus => {
        return connectionStatus === 'NETWORK_CONNECTION_COMPLETED' ? true : false;
      }),
    );
  }
}
