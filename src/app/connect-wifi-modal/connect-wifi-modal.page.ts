import { Component, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';

import { WifiNetworkService }  from '../services/device/wifi-network.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-connect-wifi-modal',
  templateUrl: './connect-wifi-modal.page.html',
  styleUrls: ['./connect-wifi-modal.page.scss'],
})
export class ConnectWifiModalPage {

  @Input() ssid: string;
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

  async saveWifi() {
    this.loading = this.presentLoading();
    if(environment.local){
      this.closeModal(true);
    } else {
      this.wifiNetworkService.connect(this.ssid, this.password)
      .subscribe(() => this.closeModal(true));
    }
  };

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
