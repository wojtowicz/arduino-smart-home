import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Device, CreateDeviceToDeviceJson } from '../../../models/device';

import { DeviceService } from '../../../services/device.service';
import { WifiDeviceService } from '../../../services/wifi-device.service';

import { GuiHelper } from '../../../helpers/gui.helper';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-connect-wifi-modal',
  templateUrl: './connect-wifi-modal.page.html',
  styleUrls: ['./connect-wifi-modal.page.scss'],
})
export class ConnectWifiModalPage {

  @Input() ssid: string;
  @Input() uuid: string;
  @Input() deviceName: string;
  password: string;

  constructor(
    public modalController: ModalController,
    private deviceService: DeviceService,
    private wifiDeviceService: WifiDeviceService,
    private guiHelper: GuiHelper
  ) { }

  dismiss(): void {
    this.closeModal(false);
  }

  saveWifi(): void {
    this.guiHelper.wrapLoading(
      this.saveWifiAndAddDevice()
    ).subscribe(() => this.closeModal(true));
  }

  saveWifiAndAddDevice(): Observable<void> {
    return new Observable(subscriber => {
      this.wifiDeviceService.saveWifi(this.ssid, this.password)
      .subscribe(() => {
        this.addDevice().subscribe(() => {
          subscriber.next();
          subscriber.complete();
        });
      });
    });
  }

  addDevice(): Observable<Device> {
    const device = { name: this.deviceName } as Device;
    return this.deviceService.createDevice(this.uuid, CreateDeviceToDeviceJson(device));
  }

  async closeModal(status: boolean): Promise<void> {
    this.modalController.dismiss({
      configured: status
    });
  }

}
