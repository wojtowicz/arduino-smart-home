export class Device {
  constructor(
    public id: number,
    public name: string,
    public uuid: string,
    public status: string,
    public syncAt: string) {  }
}

export interface DeviceJson {
  id: number;
  name: string;
  uuid: string;
  status: string;
  sync_at: string;
}

export function DeviceAdapter(json: DeviceJson): Device {
  return new Device(
    json.id,
    json.name,
    json.uuid,
    json.status,
    json.sync_at
  );
}
