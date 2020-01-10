import { Component } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { ConnectWifiModalPage } from '../connect-wifi-modal/connect-wifi-modal.page'

import { environment } from '../../environments/environment';

declare var WifiWizard2: any;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(public modalController: ModalController, public loadingController: LoadingController) {}

  results = [];
  info_txt = "";
  isDeviceConnected = false;

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    return loading;
  }

  async getNetworks() {
    const loading = this.presentLoading();
    if(environment.local){
      const sleep = m => new Promise(r => setTimeout(r, m))
      await sleep(2000);
      this.results = [{ SSID: 'SmartHomeSSID1' }, { SSID: 'SmartHomeSSID2' }, { SSID: 'SSID3' }];
    } else {
      try {
        let results = await WifiWizard2.scan();
        this.results = results;
      } catch (error) {

      }
    }
    (await loading).dismiss();
  }

  getResults() {
    return this.results.filter((item) => {
      if(this.isDeviceConnected)
        return !item.SSID.includes('SmartHome')
      else
        return item.SSID.includes('SmartHome')
    });
  }

  ngOnInit() {
    if(!environment.local) WifiWizard2.requestPermission();
  }

  async openConnectWifiModalPage(ssid: string) {
    const modal = await this.modalController.create({
      component: ConnectWifiModalPage,
      componentProps: {
        'ssid': ssid,
        'isDeviceConnected': this.isDeviceConnected
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        this.isDeviceConnected = data['data'];
    });

    return await modal.present();
  }
}
