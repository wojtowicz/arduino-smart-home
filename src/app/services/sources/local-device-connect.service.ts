import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalDeviceConnectService {

  constructor() { }

  connect(ssid: string, password: string): Observable<boolean> {
    return of(true);
  }
}
