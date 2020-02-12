export class WifiNetwork {
  constructor(
    public ssid: string,
    public encryptionType: string,
    public signalQuality: number
  ) { }
}

export interface WifiNetworkJson {
  ssid: string;
  encryption_type: string;
  signal_quality: number;
}

export function WifiNetworkAdapter(json: WifiNetworkJson): WifiNetwork {
  return new WifiNetwork(
    json.ssid,
    json.encryption_type,
    json.signal_quality
  );
}
