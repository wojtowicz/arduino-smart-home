import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { WifiDeviceService } from '../../services/wifi-device.service';
import { GuiHelper } from '../../helpers/gui.helper';

import { DeviceConnectModalPage } from '../modals/device-connect-modal/device-connect-modal.page';
import { WifiDevice } from 'src/app/models/wifi_device';

@Component({
  selector: 'app-devices-scan',
  templateUrl: './devices-scan.page.html',
  styleUrls: ['./devices-scan.page.scss'],
})
export class DevicesScanPage implements OnInit {

  wifiDevices: WifiDevice[] = [];

  constructor(
    public loadingController: LoadingController,
    private wifiDeviceService: WifiDeviceService,
    private guiHelper: GuiHelper,
    private router: Router,
    public modalController: ModalController
  ) { }

  ngOnInit(): void {
    this.scanWifi();
  }

  async presentLoading(): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    return loading;
  }

  scanWifi(): void {
    this.guiHelper.wrapLoading(
      this.wifiDeviceService.scan()
    ).subscribe(wifiDevices => this.wifiDevices = wifiDevices);
  }

  async openDeviceConnectModalPage(ssid: string): Promise<void> {
    const modal = await this.modalController.create({
      component: DeviceConnectModalPage,
      componentProps: {
        ssid
      }
    });

    modal.onDidDismiss()
      .then((results) => {
        const connected = results.data.connected;
        if (connected) { this.router.navigate(['/devices', ssid, 'wifi_networks' ]); }
    });

    return await modal.present();
  }
}
