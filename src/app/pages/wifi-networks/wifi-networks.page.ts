import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

import { WifiNetworkService } from '../../services/device/wifi-network.service';
import { catchError } from 'rxjs/operators';
import { of, Observable, forkJoin } from 'rxjs';

import { ConnectWifiModalPage } from '../../connect-wifi-modal/connect-wifi-modal.page';

import { WifiNetwork } from '../../models/wifi_network';
import { DeviceInfo } from '../../models/device-info';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-wifi-networks',
  templateUrl: './wifi-networks.page.html',
  styleUrls: ['./wifi-networks.page.scss'],
})
export class WifiNetworksPage implements OnInit {

  wifiNetworks: Array<WifiNetwork> = [];
  info: DeviceInfo;
  loading = false;
  @Input() ssid: string;
  deviceName: string;
  password: string;

  constructor(
    private wifiNetworkService: WifiNetworkService,
    private router: Router,
    public modalController: ModalController,
    public loadingController: LoadingController,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.deviceName = this.route.snapshot.paramMap.get('name');
    this.getWifiNetworks();
  }

  getWifiNetworks(): void {
    this.loading = true;
    forkJoin(
      this.wifiNetworkService.getWifiNetworks().pipe(
        catchError(this.handleError<WifiNetwork[]>('wifi_networks/connect'))
      ),
      this.wifiNetworkService.getInfo().pipe(
        catchError(this.handleError<DeviceInfo>('wifi_networks/info'))
      )
    )
    .subscribe(([wifiNetworks, info]) => {
      this.wifiNetworks = wifiNetworks;
      this.info = info;
      this.loading = false;
    });
  }

  async openConnectWifiModalPage(ssid: string) {
    const modal = await this.modalController.create({
      component: ConnectWifiModalPage,
      componentProps: {
        ssid,
        uuid: this.info.chipId,
        deviceName: this.deviceName
      }
    });

    modal.onDidDismiss()
      .then((results) => {
        const configured = results.data.configured;
        if (configured) { this.router.navigate(['/tabs/tab1']); }
    });

    return await modal.present();
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: Error | HttpErrorResponse): Observable<T> => {
      console.error(error);
      this.router.navigate(['/devices/scan']);

      return of(result as T);
    };
  }

}
