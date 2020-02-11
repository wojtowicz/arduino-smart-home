import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalDeviceConnectService {

  constructor() { }

  connect(ssid: string, password: string) {
    return of(true);
  }
}
