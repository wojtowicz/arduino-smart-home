import { Injectable } from '@angular/core';

import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Device } from '../models/device';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const devices = [
      { id: 11, name: 'InMemory SmartHome Pollution 1', uuid: 'uuid1', status: 'online' },
      { id: 12, name: 'InMemory SmartHome Pollution 2', uuid: 'uuid2', status: 'offline' },
      { id: 13, name: 'InMemory SmartHome Pollution 3', uuid: 'uuid3', status: 'online' },
    ];

    const wifiNetworks = [
      {ssid: "Orange_Swiatlowod_FAB2_2.4GHz", encryption_type: "WPA/WPA2/PSK", signal_quality: 88},
      {ssid: "DIRECT-zvM2020 Series", encryption_type: "WPA2/PSK", signal_quality: 68},
      {ssid: "Darmowe_Orange_WiFi", encryption_type: "Open", signal_quality: 60},
    ]
    return {devices, wifiNetworks};
  }

  genId<T extends { id: any }>(collection: T[], collectionName: string): any {
    if (collectionName === 'devices') {
      return collection.length > 0 ? Math.max(...collection.map(item => item.id)) + 1 : 11;
    } else if (collection) {
      return;
    }
  }
}
