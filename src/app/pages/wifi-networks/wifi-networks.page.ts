import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { WifiNetworkService } from '../../services/device/wifi-network.service';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { ConnectWifiModalPage } from '../../connect-wifi-modal/connect-wifi-modal.page';

@Component({
  selector: 'app-wifi-networks',
  templateUrl: './wifi-networks.page.html',
  styleUrls: ['./wifi-networks.page.scss'],
})
export class WifiNetworksPage implements OnInit {

  wifiNetworks = [];
  loading = false;
  @Input() ssid: string;
  password: string;

  constructor(
    private wifiNetworkService: WifiNetworkService,
    private router: Router,
    public modalController: ModalController,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.getWifiNetworks();
  }

  getWifiNetworks(): void {
    this.loading = true;
    this.wifiNetworkService.getWifiNetworks()
    .pipe(
      catchError(this.handleError<any>('wifi_networks/connect'))
    )
    .subscribe(wifiNetworks => {
      this.wifiNetworks = wifiNetworks
      this.loading = false;
    });
  }

  async openConnectWifiModalPage(ssid: string) {
    const modal = await this.modalController.create({
      component: ConnectWifiModalPage,
      componentProps: {
        'ssid': ssid
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        let configured = data['data']['configured'];
        if(configured) this.router.navigate(['/']);
    });

    return await modal.present();
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error)
      this.router.navigate(['/devices/scan']);

      return of(result as T);
    };
  }

}
