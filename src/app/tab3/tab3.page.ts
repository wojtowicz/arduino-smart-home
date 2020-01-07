import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConnectWifiModalPage } from '../connect-wifi-modal/connect-wifi-modal.page'

declare var WifiWizard2: any;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(public modalController: ModalController) {}

  // results = ["1", "2"];
  results = [];
  info_txt = "";

  async getNetworks() {
    this.info_txt = "loading...";
    try {
      let results = await WifiWizard2.scan();
      this.results = results;
      this.info_txt = "";
    } catch (error) {
      this.info_txt = error;
    }
  }

  ngOnInit() {
    WifiWizard2.requestPermission();
  }

  async openConnectWifiModalPage(ssid: string) {
    const modal = await this.modalController.create({
      component: ConnectWifiModalPage,
      componentProps: {
        'ssid': ssid
      }
    });
    return await modal.present();
  }
}
