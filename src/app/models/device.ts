export class Device {
  constructor(
    public id: number,
    public name: string,
    public uuid: string,
    public status: string,
    public lat: number,
    public lng: number,
    public coordsLabel: string,
    public wifiSSID: string,
    public localIp: string,
    public syncAt: string) {  }

    isConfiguring(): boolean {
      return this.status.includes('configuring');
    }

    isCoordsSet(): boolean {
      return !!this.lat && !!this.lng;
    }
}

export interface DeviceJson {
  id: number;
  name: string;
  uuid: string;
  status: string;
  lat: number;
  lng: number;
  coords_label: string;
  wifi_ssid: string;
  local_ip: string;
  sync_at: string;
}

export interface CreateDeviceJson {
  name: string;
  wifi_ssid: string;
  lat: number;
  lng: number;
  coords_label: string;
}

export interface UpdateDeviceJson {
  name: string;
  wifi_ssid: string;
  local_ip: string;
  lat: number;
  lng: number;
  coords_label: string;
}

export function DeviceJsonToDevice(json: DeviceJson): Device {
  return new Device(
    json.id,
    json.name,
    json.uuid,
    json.status,
    json.lat,
    json.lng,
    json.coords_label,
    json.wifi_ssid,
    json.local_ip,
    json.sync_at,
  );
}

export function CreateDeviceToDeviceJson(device: Device): CreateDeviceJson {
  return {
    name: device.name,
    wifi_ssid: device.wifiSSID,
    lat: device.lat,
    lng: device.lng,
    coords_label: device.coordsLabel
  };
}

export function UpdateDeviceToDeviceJson(device: Device): UpdateDeviceJson {
  return {
    name: device.name,
    wifi_ssid: device.wifiSSID,
    local_ip: device.localIp,
    lat: device.lat,
    lng: device.lng,
    coords_label: device.coordsLabel,
  };
}
