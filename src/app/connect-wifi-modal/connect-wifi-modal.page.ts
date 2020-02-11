import { Component, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';

import { Network } from '@ionic-native/network/ngx';

import { Device } from '../models/device';

import { WifiNetworkService }  from '../services/device/wifi-network.service';
import { DeviceService } from '../services/device.service';

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
    private deviceService: DeviceService,
    private network: Network
  ) { }

  dismiss() {
    this.modalController.dismiss({
      'configured': false
    });
  }

  saveWifi() {
    this.loading = this.presentLoading();
    let wifiConnected = false;
    let networkConnected = false;
    let addingDevice = false;
    console.log('saveWifi');
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('onDisconnect subscribe');
      networkConnected = false;
    });
    let connectSubscription = this.network.onConnect().subscribe(() => {
      networkConnected = true;
      console.log('connectSubscription subscribe');
      console.log(wifiConnected);
      if(wifiConnected) {
        setTimeout(() => {
          console.log(this.network.type);
          console.log(networkConnected);
          if(networkConnected && !addingDevice){
            addingDevice = true;
            this.addDevice();
            connectSubscription.unsubscribe();
            disconnectSubscription.unsubscribe();
          }
        }, 3000);
      }
    });

    this.wifiNetworkService.connect(this.ssid, this.password)
      .subscribe(() => {
        wifiConnected = true;
        console.log('wifiNetworkService connect');
        console.log(networkConnected);
        if(networkConnected) {
          this.addDevice();
          connectSubscription.unsubscribe();
        }
      });
  };

  addDevice() {
    this.deviceService.updateDevice(
      {
        name: this.deviceName,
        uuid: this.uuid,
        status: 'configuring',
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
