import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Device, CreateDeviceToDeviceJson } from '../../../models/device';

import { DeviceService } from '../../../services/device.service';
import { WifiDeviceService } from '../../../services/wifi-device.service';
import { GeolocationService } from '../../../services/geolocation.service';

import { GuiHelper } from '../../../helpers/gui.helper';
import { Observable } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { Coords } from 'src/app/models/coords';

@Component({
  selector: 'app-connect-wifi-modal',
  templateUrl: './connect-wifi-modal.page.html',
  styleUrls: ['./connect-wifi-modal.page.scss'],
})
export class ConnectWifiModalPage {

  @Input() deviceName: string;
  @Input() deviceUUID: string;
  @Input() deviceLocalIp: string;
  @Input() ssid: string;
  password: string;

  constructor(
    public modalController: ModalController,
    private deviceService: DeviceService,
    private wifiDeviceService: WifiDeviceService,
    private geolocationService: GeolocationService,
    private guiHelper: GuiHelper,

  ) { }

  dismiss(): void {
    this.closeModal(false);
  }

  saveWifi(): void {
    console.log('saveWifi');
    this.guiHelper.wrapLoading(
      this.saveWifiAndAddDevice()
    ).subscribe(() => this.closeModal(true));
  }

  saveWifiAndAddDevice(): Observable<void> {
    return new Observable(subscriber => {
      this.wifiDeviceService.saveWifi(this.ssid, this.password, this.deviceLocalIp)
        .pipe(
          flatMap(() => this.geolocationService.getCurrentPosition()),
          flatMap((coords: Coords) => this.addDevice(coords)),
        ).subscribe(() => {
          subscriber.next();
          subscriber.complete();
        });
    });
  }

  addDevice(coords: Coords): Observable<Device> {
    const device = {
      name: this.deviceName,
      wifiSSID: this.ssid,
      lat: coords.lat,
      lng: coords.lng,
      coordsLabel: coords.label
    } as Device;
    return this.deviceService.createDevice(this.deviceUUID, CreateDeviceToDeviceJson(device));
  }

  async closeModal(status: boolean): Promise<void> {
    this.modalController.dismiss({
      configured: status
    });
  }

}
