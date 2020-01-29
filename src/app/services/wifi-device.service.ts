import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { toArray, filter } from 'rxjs/operators';

import { WifiDevice } from '../models/wifi_device';

import { LocalWifiDeviceSourceService } from '../services/sources/local-wifi-device-source.service';
import { RemoteWifiDeviceSourceService } from '../services/sources/remote-wifi-device-source.service';

@Injectable({
  providedIn: 'root'
})
export class WifiDeviceService {

  dataSources = {
    'local': this.localWifiDeviceSourceService,
    'remote': this.remoteWifiDeviceSourceService
  }

  constructor(
    private localWifiDeviceSourceService: LocalWifiDeviceSourceService,
    private remoteWifiDeviceSourceService: RemoteWifiDeviceSourceService
  ) { }

  scan() {
    let wifiNetworksObservable: Observable<WifiDevice>;

    wifiNetworksObservable = this.dataSources[environment.dataSource].scan();
    return wifiNetworksObservable.pipe(
      filter(wifiDevice => wifiDevice.SSID.includes('SmartHome')),
      toArray()
    );
  }
}
