export class Device {
  constructor(
    public id: number,
    public name: string,
    public uuid: string,
    public status: string,
    public syncAt: string) {  }

    isConfiguring(): boolean {
      return this.status.includes('configuring');
    }

}

export interface DeviceJson {
  id: number;
  name: string;
  uuid: string;
  status: string;
  sync_at: string;
}

export function DeviceJsonToDevice(json: DeviceJson): Device {
  return new Device(
    json.id,
    json.name,
    json.uuid,
    json.status,
    json.sync_at
  );
}

export function DeviceToDeviceJson(device: Device): DeviceJson {
  return {
    id: device.id,
    name: device.name,
    uuid: device.uuid,
    status: device.status,
    sync_at: device.syncAt
  };
}
