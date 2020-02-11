import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';


import { DeviceConnectService } from '../../../services/device-connect.service';

declare var WifiWizard2: any;

@Component({
  selector: 'app-device-connect-modal',
  templateUrl: './device-connect-modal.page.html',
  styleUrls: ['./device-connect-modal.page.scss'],
})
export class DeviceConnectModalPage implements OnInit {

  @Input() ssid: string;
  password: string;
  loading: any;

  constructor(
    public modalController: ModalController,
    public loadingController: LoadingController,
    private deviceConnectService: DeviceConnectService
  ) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss({'connected': false});
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await this.loading.present();

    return this.loading;
  }

  async connect() {
    this.loading = this.presentLoading();
    this.deviceConnectService.connect(this.ssid, this.password)
                             .subscribe(status => this.closeModal(status));
  }

  async closeModal(status: boolean) {
    (await this.loading).dismiss();
    this.modalController.dismiss({
      'connected': status
    });
  }

  async connectToWifi() {
    try {
      let connectionStatus = await WifiWizard2.connect(this.ssid, true, this.password);
      let status = connectionStatus == 'NETWORK_CONNECTION_COMPLETED' ? true : false
      this.closeModal(status);
    } catch (error) {
      console.log(error);
    }
  }

}
