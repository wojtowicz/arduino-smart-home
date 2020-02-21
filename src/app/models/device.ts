export class Device {
  constructor(
    public id: number,
    public name: string,
    public uuid: string,
    public status: string,
    public lat: number,
    public lng: number,
    public coordsLabel: string,
    public airlyApiKey: string,
    public syncAt: string) {  }

    isConfiguring(): boolean {
      return this.status.includes('configuring');
    }

    isCoordsSet(): boolean {
      return !!this.lat && !!this.lng;
    }

    airlyApiKeyPreview(): string {
      if(this.airlyApiKey)
        return `************${this.airlyApiKey.substr(this.airlyApiKey.length - 3)}`;
      else
        return '';
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
  airly_api_key: string;
  sync_at: string;
}

export interface CreateDeviceJson {
  name: string;
}

export interface UpdateDeviceJson {
  name: string;
  lat: number;
  lng: number;
  coords_label: string;
  airly_api_key: string;
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
    json.airly_api_key,
    json.sync_at,
  );
}

export function CreateDeviceToDeviceJson(device: Device): CreateDeviceJson {
  return {
    name: device.name,
  };
}

export function UpdateDeviceToDeviceJson(device: Device): UpdateDeviceJson {
  return {
    name: device.name,
    lat: device.lat,
    lng: device.lng,
    coords_label: device.coordsLabel,
    airly_api_key: device.airlyApiKey
  };
}
