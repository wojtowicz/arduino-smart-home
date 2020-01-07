import { Component, Input } from '@angular/core';

import { ModalController, NavParams } from '@ionic/angular';

declare var WifiWizard2: any;

@Component({
  selector: 'app-connect-wifi-modal',
  templateUrl: './connect-wifi-modal.page.html',
  styleUrls: ['./connect-wifi-modal.page.scss'],
})
export class ConnectWifiModalPage {

  @Input() ssid: string;
  password: string;

  constructor(public modalController: ModalController) {
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  connect() {
    console.log(this.ssid)
    console.log(this.password);
    WifiWizard2.connect(this.ssid, true, this.password);
  }

}
