import { LocalDeviceConnectService } from '../services/sources/local-device-connect.service';
import { RemoteDeviceConnectService } from '../services/sources/remote-device-connect.service';

export function DeviceConnectFactory(dataSource: string): LocalDeviceConnectService | RemoteDeviceConnectService {
  const dataSources = {
    local: LocalDeviceConnectService,
    remote: RemoteDeviceConnectService,
    localhost: LocalDeviceConnectService
  };

  return new dataSources[dataSource]();
}
