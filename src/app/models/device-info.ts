export class DeviceInfo {
  chipId: number;
}

export interface DeviceInfoJson {
  chip_id: number;
}

export function DeviceInfoAdapter(json: DeviceInfoJson): DeviceInfo {
  return {
    chipId: json.chip_id,
  };
}
