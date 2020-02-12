import { Injectable } from '@angular/core';

import { LocalDeviceConnectService } from './sources/local-device-connect.service';
import { RemoteDeviceConnectService } from './sources/remote-device-connect.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceConnectService {

  dataSources = {
    local: this.localDeviceConnectService,
    remote: this.remoteDeviceConnectService,
    localhost: this.localDeviceConnectService,
  };

  constructor(
    private localDeviceConnectService: LocalDeviceConnectService,
    private remoteDeviceConnectService: RemoteDeviceConnectService
  ) { }

  connect(ssid: string, password: string) {
    let deviceConnectObservable: Observable<boolean>;

    deviceConnectObservable = this.dataSources[environment.dataSource].connect(ssid, password);
    return deviceConnectObservable;
  }

}
