export class Device {
  id: number;
  name: string;
  uuid: string;
  status: string;
  lol() {
    return status === 'configuring';
  }
}
