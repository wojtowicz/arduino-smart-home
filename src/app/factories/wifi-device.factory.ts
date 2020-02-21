import { LocalWifiDeviceSourceService } from '../services/sources/local-wifi-device-source.service';
import { RemoteWifiDeviceSourceService } from '../services/sources/remote-wifi-device-source.service';
import { WifiNetworkService } from '../services/device/wifi-network.service';
import { Network } from '@ionic-native/network/ngx';

export function WifiDeviceFactory(
  dataSource: string,
  network: Network,
  wifiNetworkService: WifiNetworkService): LocalWifiDeviceSourceService | RemoteWifiDeviceSourceService {
    if (dataSource === 'local' || dataSource === 'localhost') {
      return new LocalWifiDeviceSourceService(wifiNetworkService);
    } else if (dataSource === 'remote') {
      return new RemoteWifiDeviceSourceService(network, wifiNetworkService);
    } else {
      return undefined;
    }
}
