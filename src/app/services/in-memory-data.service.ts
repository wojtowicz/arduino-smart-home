import { Injectable } from '@angular/core';

import { InMemoryDbService } from 'angular-in-memory-web-api';
import { getStatusText, STATUS } from 'angular-in-memory-web-api/http-status-codes';
import { RequestInfo, ResponseOptions } from 'angular-in-memory-web-api/interfaces';
import { WifiNetworkJson } from '../models/wifi_network';
import { Observable } from 'rxjs';

const info = { mac_address: '00:11:22:33:44', chip_id: 'someuuid' };

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb(): { wifiNetworks: WifiNetworkJson[]; } {
    const wifiNetworks: WifiNetworkJson[] = [
      {ssid: 'Orange_Swiatlowod_FAB2_2.4GHz', encryption_type: 'WPA/WPA2/PSK', signal_quality: 88},
      {ssid: 'DIRECT-zvM2020 Series', encryption_type: 'WPA2/PSK', signal_quality: 68},
      {ssid: 'Darmowe_Orange_WiFi', encryption_type: 'Open', signal_quality: 60},
    ];

    return {wifiNetworks};
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
