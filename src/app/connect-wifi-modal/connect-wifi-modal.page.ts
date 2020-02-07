import { Component, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';

import { Device } from '../models/device';

import { WifiNetworkService }  from '../services/device/wifi-network.service';
import { DeviceService } from '../services/device.service';
import { environment } from 'src/environments/environment';

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
    private wifiNetworkService: WifiNetworkService,
    private deviceService: DeviceService
  ) { }

  dismiss() {
    this.modalController.dismiss({
      'configured': false
    });
  }

  async saveWifi() {
    this.loading = this.presentLoading();
    this.wifiNetworkService.connect(this.ssid, this.password)
      .subscribe(() => this.addDevice());
  };

  addDevice() {
    this.deviceService.addDevice(
      {
        name: this.deviceName,
        uuid: this.uuid,
        status: 'configuring'
      } as Device)
      .subscribe(device => {
        this.closeModal(true)
      });
  }

  async closeModal(status: boolean) {
    (await this.loading).dismiss();
    this.modalController.dismiss({
      'configured': status
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await this.loading.present();

    return this.loading;
  }

}
