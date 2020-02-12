import { Component, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';

import { Device } from '../models/device';

import { DeviceService } from '../services/device.service';
import { WifiDeviceService } from '../services/wifi-device.service';

import { GuiHelper } from '../helpers/gui.helper';
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
  loading: any;

  constructor(
    public modalController: ModalController,
    public loadingController: LoadingController,
    private deviceService: DeviceService,
    private wifiDeviceService: WifiDeviceService,
    private guiHelper: GuiHelper
  ) { }

  dismiss() {
    this.closeModal(false);
  }

  saveWifi() {
    this.guiHelper.wrapLoading(
      this.saveWifiAndAddDevice()
    ).subscribe(() => this.closeModal(true));
  };

  saveWifiAndAddDevice() {
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

  addDevice() {
    return this.deviceService.createDevice(
      {
        name: this.deviceName,
        uuid: this.uuid,
        status: 'configuring',
        sync_at: null
      } as Device)
  }

  async closeModal(status: boolean) {
    this.modalController.dismiss({
      'configured': status
    });
  }

}
