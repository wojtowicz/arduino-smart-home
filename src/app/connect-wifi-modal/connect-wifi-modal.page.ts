import { Component, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';

import { environment } from '../../environments/environment';

import { WifiNetworkService }  from '../services/device/wifi-network.service';

declare var WifiWizard2: any;

@Component({
  selector: 'app-connect-wifi-modal',
  templateUrl: './connect-wifi-modal.page.html',
  styleUrls: ['./connect-wifi-modal.page.scss'],
})
export class ConnectWifiModalPage {

  @Input() ssid: string;
  @Input() isDeviceConnected: boolean;
  password: string;
  loading: any;

  constructor(
    public modalController: ModalController,
    public loadingController: LoadingController,
    private wifiNetworkService: WifiNetworkService
  ) { }

  dismiss() {
    this.modalController.dismiss();
  }

  async connect() {
    this.loading = this.presentLoading();
    if(this.isDeviceConnected)
      this.saveWifi();
    else
      this.connectToDevice();
  }

  saveWifi() {
    this.wifiNetworkService.connect(this.ssid, this.password)
        .subscribe(() => this.closeModal('configured'));
  };

  async connectToDevice() {
    if(environment.local){
      this.closeModal('connected');
    } else {
      this.connectToWifi();
    }
  }

  async connectToWifi() {
    try {
      let connectionStatus = await WifiWizard2.connect(this.ssid, true, this.password);
      let status = connectionStatus == 'NETWORK_CONNECTION_COMPLETED' ? "connected" : ""
      this.closeModal(status);
    } catch (error) {
      console.log(error);
    }
  }

  async closeModal(status: string) {
    (await this.loading).dismiss();
    this.modalController.dismiss({
      'status': status
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
