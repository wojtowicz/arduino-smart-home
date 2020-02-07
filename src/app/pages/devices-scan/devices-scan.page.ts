import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { WifiDeviceService } from '../../services/wifi-device.service';
import { GuiHelper } from '../../helpers/gui.helper';

import { DeviceConnectModalPage } from '../modals/device-connect-modal/device-connect-modal.page';

@Component({
  selector: 'app-devices-scan',
  templateUrl: './devices-scan.page.html',
  styleUrls: ['./devices-scan.page.scss'],
})
export class DevicesScanPage implements OnInit {

  wifiDevices = [];
  deviceStatus = "";

  constructor(
    public loadingController: LoadingController,
    private wifiDeviceService: WifiDeviceService,
    private guiHelper: GuiHelper,
    private router: Router,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.scanWifi();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    return loading;
  }

  scanWifi() {
    this.guiHelper.wrapLoading(
      this.wifiDeviceService.scan()
    ).subscribe(wifiDevices => this.wifiDevices = wifiDevices);
  }

  async openDeviceConnectModalPage(ssid: string) {
    const modal = await this.modalController.create({
      component: DeviceConnectModalPage,
      componentProps: {
        'ssid': ssid,
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        let connected = data['data']['connected'];
        if(connected) this.router.navigate(['/devices', ssid, 'wifi_networks' ]);
    });

    return await modal.present();
  }
}
