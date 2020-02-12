import { Injectable } from '@angular/core';

import { InMemoryDbService } from 'angular-in-memory-web-api';
import { getStatusText, STATUS } from 'angular-in-memory-web-api/http-status-codes';
import { RequestInfo, ResponseOptions } from 'angular-in-memory-web-api/interfaces';
import { DeviceJson } from '../models/device';
import { WifiNetworkJson } from '../models/wifi_network';
import { Observable } from 'rxjs';

const info = { mac_address: '00:11:22:33:44', chip_id: 'someuuid' };

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb(): { devices: DeviceJson[]; wifiNetworks: WifiNetworkJson[]; } {
    const devices: DeviceJson[] = [
      { id: 11, name: 'InMemory SmartHome Pollution 1', uuid: 'uuid1', status: 'online', sync_at: null },
      { id: 12, name: 'InMemory SmartHome Pollution 2', uuid: 'uuid2', status: 'offline', sync_at: null },
      { id: 13, name: 'InMemory SmartHome Pollution 3', uuid: 'uuid3', status: 'online', sync_at: null },
    ];

    const wifiNetworks: WifiNetworkJson[] = [
      {ssid: 'Orange_Swiatlowod_FAB2_2.4GHz', encryption_type: 'WPA/WPA2/PSK', signal_quality: 88},
      {ssid: 'DIRECT-zvM2020 Series', encryption_type: 'WPA2/PSK', signal_quality: 68},
      {ssid: 'Darmowe_Orange_WiFi', encryption_type: 'Open', signal_quality: 60},
    ];

    return {devices, wifiNetworks};
  }

  genId<T extends { id: number }>(collection: T[], collectionName: string): number {
    if (collectionName === 'devices') {
      return collection.length > 0 ? Math.max(...collection.map(item => item.id)) + 1 : 11;
    } else if (collection) {
      return;
    }
  }

  get(reqInfo: RequestInfo): Observable<ResponseOptions> {
    const collectionName = reqInfo.collectionName;
    if (collectionName === 'info') {
      return this.getInfo(reqInfo);
    }
    return undefined;
  }

  post(reqInfo: RequestInfo): Observable<ResponseOptions> {
    const collectionName = reqInfo.collectionName;
    const id = reqInfo.id;

    if (collectionName === 'wifiNetworks' && id === 'connect') {
      return this.successResponse(reqInfo);
    }
    return undefined;
  }

  private getInfo(reqInfo: RequestInfo): Observable<ResponseOptions> {
    return reqInfo.utils.createResponse$(() => {
      const options: ResponseOptions = {
          body: info,
          status: STATUS.OK
        };
      return this.finishOptions(options, reqInfo);
    });
  }

  private successResponse(reqInfo: RequestInfo): Observable<ResponseOptions> {
    return reqInfo.utils.createResponse$(() => {
      const options: ResponseOptions = {
          body: {},
          status: STATUS.OK
        };
      return this.finishOptions(options, reqInfo);
    });
  }

  private finishOptions(options: ResponseOptions, {headers, url}: RequestInfo): ResponseOptions {
    options.statusText = getStatusText(options.status);
    options.headers = headers;
    options.url = url;
    return options;
  }
}
