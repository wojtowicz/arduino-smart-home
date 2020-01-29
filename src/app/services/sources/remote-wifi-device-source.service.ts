import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { mergeAll } from 'rxjs/operators';

declare var WifiWizard2: any;

@Injectable({
  providedIn: 'root'
})
export class RemoteWifiDeviceSourceService {

  constructor() { }

  scan() {
    return from(WifiWizard2.scan()).pipe(mergeAll());
  }
}
