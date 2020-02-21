import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { DeviceConnectService } from '../device-connect.service';

@Injectable({
  providedIn: 'root'
})
export class LocalDeviceConnectService extends DeviceConnectService {
  connect(ssid: string, password: string): Observable<boolean> {
    return of(true);
  }
}
