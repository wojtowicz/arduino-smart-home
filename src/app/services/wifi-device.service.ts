import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { toArray, filter } from 'rxjs/operators';

import { WifiDevice } from '../models/wifi_device';

import { LocalWifiDeviceSourceService } from '../services/sources/local-wifi-device-source.service';
import { RemoteWifiDeviceSourceService } from '../services/sources/remote-wifi-device-source.service';
import { WifiNetworkService } from './device/wifi-network.service';

@Injectable({
  providedIn: 'root'
})
export class WifiDeviceService {

  dataSources = {
    'local': this.localWifiDeviceSourceService,
    'remote': this.remoteWifiDeviceSourceService,
    'localhost': this.localWifiDeviceSourceService
  }

  constructor(
    private localWifiDeviceSourceService: LocalWifiDeviceSourceService,
    private remoteWifiDeviceSourceService: RemoteWifiDeviceSourceService,
    private wifiNetworkService: WifiNetworkService
  ) { }

  getDataSourceDevice() {
    return this.dataSources[environment.dataSource];
  }

  scan() {
    let wifiDeviceObservable: Observable<WifiDevice>;

    wifiDeviceObservable = this.getDataSourceDevice().scan();
    return wifiDeviceObservable.pipe(
      filter(wifiDevice => wifiDevice.SSID.includes('SmartHome')),
      toArray()
    );
  }

  saveWifi(ssid: string, password: string) {
    return new Observable(subscriber => {
      this.getDataSourceDevice().listenOnNetworkConnect()
      .subscribe(() => {
        subscriber.next();
        subscriber.complete();
      });

      this.wifiNetworkService.connect(ssid, password).subscribe();
    });
  }
}
