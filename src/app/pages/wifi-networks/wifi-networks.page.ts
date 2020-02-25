import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { WifiNetworkService } from '../../services/device/wifi-network.service';
import { catchError } from 'rxjs/operators';
import { of, Observable, forkJoin } from 'rxjs';

import { ConnectWifiModalPage } from '../modals/connect-wifi-modal/connect-wifi-modal.page';

import { WifiNetwork } from '../../models/wifi_network';
import { DeviceInfo } from '../../models/device-info';
import { HttpErrorResponse } from '@angular/common/http';
import { Device, UpdateDeviceToDeviceJson } from 'src/app/models/device';
import { DeviceService } from 'src/app/services/device.service';

@Component({
  selector: 'app-wifi-networks',
  templateUrl: './wifi-networks.page.html',
  styleUrls: ['./wifi-networks.page.scss'],
})
export class WifiNetworksPage implements OnInit {

  wifiNetworks: Array<WifiNetwork> = [];
  info: DeviceInfo;
  device: Device;
  loading: boolean;
  @Input() ssid: string;
  password: string;

  constructor(
    private wifiNetworkService: WifiNetworkService,
    private deviceService: DeviceService,
    private router: Router,
    private location: Location,
    public modalController: ModalController,
    public loadingController: LoadingController,
    private route: ActivatedRoute,
    public alertController: AlertController,
  ) {
    route.params.subscribe(_params => {
      this.getDevice().subscribe(device => {
        this.device = device;
        this.getWifiNetworks();
      });
    });
  }

  ngOnInit(): void {
  }

  getDevice(): Observable<Device> {
    return new Observable(subscriber => {
      let uuid = this.route.snapshot.paramMap.get('uuid');
      let deviceName = this.route.snapshot.queryParamMap.get('device_name');
      let newDevice = { uuid, name: deviceName } as Device;

      if(deviceName){
        subscriber.next(newDevice);
        subscriber.complete();
      } else {
        this.deviceService.getDevice(uuid).subscribe(returnedDevice => {
          const device = returnedDevice || newDevice;
          subscriber.next(device);
          subscriber.complete();
        });
      }
    });
  }

  getWifiNetworks(): void {
    this.loading = true;
    this.wifiNetworkService.getWifiNetworks(this.device.localIp).pipe(
      catchError(this.handleError<WifiNetwork[]>('wifi_networks/connect'))
    )
    .subscribe(wifiNetworks => {
      this.wifiNetworks = wifiNetworks;
      this.loading = false;
    });
  }

  async openConnectWifiModalPage(ssid: string): Promise<void> {
    const modal = await this.modalController.create({
      component: ConnectWifiModalPage,
      componentProps: {
        deviceName: this.device.name,
        deviceUUID: this.device.uuid,
        deviceLocalIp: this.device.localIp,
        ssid: ssid
      }
    });

    modal.onDidDismiss()
      .then((results) => {
        const configured = results.data.configured;
        if (configured) {
          this.router.navigate(['/tabs/tab1']);
        }
    });

    return await modal.present();
  }

  async presentDisconnectDeviceConfirm() {
    const alert = await this.alertController.create({
      header: 'Disconnect device!',
      message: 'Are you sure you want to disconnect device?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Okay',
          cssClass: 'danger',
          handler: () => {
            this.wifiNetworkService.disconnect(this.device.localIp).subscribe(()=> {
              this.device.localIp = null;
              this.device.wifiSSID = null;
              this.deviceService.updateDevice(this.device.uuid, UpdateDeviceToDeviceJson(this.device)).subscribe(() => {
                this.location.back();
              })
            });
          }
        }
      ]
    })

    await alert.present();
  }

  private handleError<T>(operation: string = 'operation', result?: T): (error: Error | HttpErrorResponse) => Observable<T> {
    return (error: Error | HttpErrorResponse): Observable<T> => {
      console.error(error);
      this.router.navigate(['/devices/scan']);

      return of(result as T);
    };
  }

}
