import { Component, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';

import { environment } from '../../environments/environment';

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

  constructor(public modalController: ModalController, public loadingController: LoadingController) {
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async connect() {
    if(this.isDeviceConnected)
      this.saveWifi();
    else
      this.connectToDevice();
  }

  saveWifi() {

  }

  async connectToDevice() {
    const loading = this.presentLoading();
    if(environment.local){
      (await loading).dismiss();
      this.modalController.dismiss({
        'connected': true
      });
    } else {
      try {
        let connectionStatus = await WifiWizard2.connect(this.ssid, true, this.password);
        (await loading).dismiss();
        this.modalController.dismiss({
          'connected': connectionStatus == 'NETWORK_CONNECTION_COMPLETED'
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    return loading;
  }

}
