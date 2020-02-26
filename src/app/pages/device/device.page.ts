import { Component, OnDestroy } from '@angular/core';
import { DeviceService } from 'src/app/services/device.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GuiHelper } from 'src/app/helpers/gui.helper';

import { Device, UpdateDeviceToDeviceJson } from '../../models/device';
import { Subscription, interval, forkJoin } from 'rxjs';
import { tap, flatMap } from 'rxjs/operators';

import { GeolocationService } from '../../services/geolocation.service';

import { tileLayer, latLng, marker, icon, LatLng, Marker, TileLayer } from 'leaflet';
import { AlertController, ToastController } from '@ionic/angular';
import { Coords } from 'src/app/models/coords';
import { WifiNetworkService } from 'src/app/services/device/wifi-network.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
})

export class DevicePage implements OnDestroy {
  device: Device;
  configuring: Subscription;
  loading: boolean;
  uuid: string;

  currentCoords: Coords;

  center: LatLng = latLng(46.879966, -121.726909);
  zoom: number = 5;
  layers: Array<Marker> = [];

  options: { layers: Array<TileLayer>, zoom: number, center: LatLng } = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: this.zoom,
    center: this.center
  };

  constructor(
    private deviceService: DeviceService,
    private route: ActivatedRoute,
    private guiHelper: GuiHelper,
    private geolocationService: GeolocationService,
    public alertController: AlertController,
    public toastController: ToastController,
    private router: Router,
    private wifiNetworkService: WifiNetworkService,
  ) {
    route.params.subscribe(val => {
      this.uuid = this.route.snapshot.paramMap.get('uuid');

      this.guiHelper.wrapLoading(
        forkJoin([
          this.geolocationService.getCurrentPosition(),
          this.deviceService.getDevice(this.uuid)
        ])
      )
      .subscribe(([coords, device]) => {
        this.device = device;
        this.subscribeConfiguringDevices();

        this.currentCoords = coords;
        if (this.device.isCoordsSet()) {
          this.centerTo(this.device.lat, this.device.lng);
          this.createMarkerFor(this.device.lat, this.device.lng);
        } else {
          this.centerTo(this.currentCoords.lat, this.currentCoords.lng);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.configuring.unsubscribe();
  }

  subscribeConfiguringDevices(): void {
    this.configuring = interval(3000)
      .subscribe(i => this.checkConfiguringDevice());
  }

  checkConfiguringDevice(): void {
    if (this.device.isConfiguring()) {
      this.getDeviceStatus();
    }
  }

  getDeviceStatus(): void {
    this.loading = true;
    this.deviceService.getDevice(this.uuid)
      .pipe(
          tap(device => this.loading = false)
        )
      .subscribe(device => this.device.status = device.status);
  }

  createMarkerFor(lat: number, lng: number): void {
    this.layers = [
      marker([ lat, lng ], {
        icon: icon({
           iconSize: [ 25, 41 ],
           iconAnchor: [ 13, 41 ],
           iconUrl: 'assets/marker-icon.png',
           shadowUrl: 'assets/marker-shadow.png'
        })
     })
    ];
  }

  centerTo(lat: number, lng: number): void {
    this.center = latLng(lat, lng);
    this.zoom = 15;
  }

  onClickMap(event: { latlng: { lat: number, lng: number } }): void {
    this.device.lat = event.latlng.lat;
    this.device.lng = event.latlng.lng;
    this.createMarkerFor(this.device.lat, this.device.lng);
    this.geolocationService.getCoordsLabel(this.device.lat, this.device.lng).subscribe((coords) => {
      this.device.coordsLabel = coords.label;
      this.save();
    });
  }

  save(): void {
    this.guiHelper.wrapLoading(
      this.deviceService.updateDevice(this.device.uuid, UpdateDeviceToDeviceJson(this.device))
    ).subscribe();
  }

  async presentNamePrompt(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Name',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name',
          value: this.device.name
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Save',
          handler: (data: { name: string }) => {
            if (data.name) {
              this.device.name = data.name;
              this.save();
            } else {
              this.presentToast('Name can\'t be empty');
              return false;
            }

          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  async presentDeleteDeviceConfirm(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Delete device!',
      message: 'Are you sure you want to delete device?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Okay',
          cssClass: 'danger',
          handler: () => {
            this.guiHelper.wrapLoading(
              this.wifiNetworkService.disconnect(this.device.localIp)).pipe(
                flatMap(() => this.deviceService.deleteDevice(this.device.uuid))
            ).subscribe(() => {
              this.router.navigate(['/tabs/tab1']);
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
