import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';

import { DeviceConnectService } from '../../../services/device-connect.service';

import { GuiHelper } from '../../../helpers/gui.helper';

/* tslint:disable no-any */
declare var WifiWizard2: any;
/* tslint:enable no-any */

@Component({
  selector: 'app-device-connect-modal',
  templateUrl: './device-connect-modal.page.html',
  styleUrls: ['./device-connect-modal.page.scss'],
})
export class DeviceConnectModalPage implements OnInit {

  @Input() ssid: string;
  password: string;

  constructor(
    public modalController: ModalController,
    public loadingController: LoadingController,
    private deviceConnectService: DeviceConnectService,
    private guiHelper: GuiHelper
  ) { }

  ngOnInit(): void {
  }

  dismiss(): void {
    this.closeModal(false);
  }

  async connect(): Promise<void> {
    this.guiHelper.wrapLoading(
      this.deviceConnectService.connect(this.ssid, this.password)
    ).subscribe((status) => this.closeModal(status));
  }

  async closeModal(status: boolean): Promise<void> {
    this.modalController.dismiss({
      connected: status
    });
  }

  async connectToWifi(): Promise<void> {
    try {
      const connectionStatus = await WifiWizard2.connect(this.ssid, true, this.password);
      const status = connectionStatus === 'NETWORK_CONNECTION_COMPLETED' ? true : false;
      this.closeModal(status);
    } catch (error) {
      console.log(error);
    }
  }

}
