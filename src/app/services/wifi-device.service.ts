import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { toArray, filter } from 'rxjs/operators';

import { WifiDevice } from '../models/wifi_device';

import { WifiNetworkService } from './device/wifi-network.service';

@Injectable({
  providedIn: 'root'
})
export abstract class WifiDeviceService {
  constructor(public wifiNetworkService: WifiNetworkService) { }

  abstract listenOnNetworkConnect(): Observable<void>;
  abstract scan(): Observable<WifiDevice>;

  scanAll(): Observable<WifiDevice[]> {
    return this.scan().pipe(
      filter(wifiDevice => wifiDevice.SSID.includes('SmartHome')),
      toArray()
    );
  }

  filterFunction(wifiDevice: WifiDevice): boolean {
    return wifiDevice.SSID.includes('SmartHome');
  }

  saveWifi(ssid: string, password: string): Observable<void> {
    return new Observable(subscriber => {
      this.listenOnNetworkConnect()
      .subscribe(() => {
        subscriber.next();
        subscriber.complete();
      });

      this.wifiNetworkService.connect(ssid, password).subscribe();
    });
  }
}
