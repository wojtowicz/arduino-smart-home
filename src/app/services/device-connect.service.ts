import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class DeviceConnectService {
  abstract connect(ssid: string, password: string): Observable<boolean>;
}
