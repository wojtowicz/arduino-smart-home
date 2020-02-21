export class WifiDevice {
  constructor(public SSID: string) { }
}

export interface WifiDeviceJson {
  SSID: string;
}

export function WifiDeviceAdapter(json: WifiDeviceJson): WifiDevice {
  return new WifiDevice(
    json.SSID,
  );
}
