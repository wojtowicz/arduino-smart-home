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
    return {devices};
  }

  genId(devices: Device[]): number {
    return devices.length > 0 ? Math.max(...devices.map(hero => hero.id)) + 1 : 11;
  }
}
