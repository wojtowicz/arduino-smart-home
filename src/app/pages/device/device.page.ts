import { Component, OnInit } from '@angular/core';
import { DeviceService } from 'src/app/services/device.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GuiHelper } from 'src/app/helpers/gui.helper';

import { Device, UpdateDeviceToDeviceJson } from '../../models/device'
import { Subscription, interval, Observable, from, forkJoin, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { OpenStreetMapProvider } from 'leaflet-geosearch';

import { tileLayer, latLng, marker, icon } from 'leaflet'
import { AlertController, ToastController } from '@ionic/angular';

class Coords {
  constructor(
    public lat: number,
    public lng: number) {  }
}

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
})

export class DevicePage implements OnInit {

  device: Device;
  configuring: Subscription;
  loading: boolean;
  uuid: string;

  currentCoords: Coords;

  center = latLng(46.879966, -121.726909);
  zoom = 5;
  layers = [];

  options = {
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
    private geolocation: Geolocation,
    public alertController: AlertController,
    public toastController: ToastController,
    private router: Router,
  ) {
    route.params.subscribe(val => {
      this.uuid = this.route.snapshot.paramMap.get('uuid');

      this.guiHelper.wrapLoading(
        forkJoin(
          this.getCurrentPosition(),
          this.deviceService.getDevice(this.uuid)
        )
      )
      .subscribe(([coords, device]) => {
        this.device = device;
        this.subscribeConfiguringDevices();

        this.currentCoords = coords;
        if(this.device.isCoordsSet()){
          this.centerTo(this.device.lat, this.device.lng);
          this.createMarkerFor(this.device.lat, this.device.lng);
        } else {
          this.centerTo(this.currentCoords.lat, this.currentCoords.lng);
        }
      });
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.configuring.unsubscribe();
  }

  getCurrentPosition(): Observable<Coords> {
    return new Observable(subscriber => {
      from(this.geolocation.getCurrentPosition()).pipe(
        catchError(error => {
          return of({ coords: { latitude: undefined, longitude: undefined } });
        })
      )
      .subscribe(resp => {
        const coords = new Coords(resp.coords.latitude, resp.coords.longitude)
        subscriber.next(coords);
        subscriber.complete();
      })
    });
  }

  subscribeConfiguringDevices(): void {
    this.configuring = interval(3000)
      .subscribe(_i => this.checkConfiguringDevice());
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
          tap(_device => this.loading = false)
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

  centerTo(lat: number, lng: number): void{
    this.center = latLng(lat, lng);
    this.zoom = 15;
  }

  onClickMap(event: { latlng: { lat: number, lng: number } }) {
    this.device.lat = event.latlng.lat;
    this.device.lng = event.latlng.lng;
    this.createMarkerFor(this.device.lat, this.device.lng);
    const provider = new OpenStreetMapProvider();
    from(provider.search({ query: this.device.lat + ' ' + this.device.lng }))
      .subscribe((result: { label: string }[]) => {
        const coordsData = result[0];
        if(coordsData){
          this.device.coordsLabel = coordsData.label;
        }
        else{
          this.device.coordsLabel = '';
        }
        this.save();
      });
  }

  save(): void {
    this.guiHelper.wrapLoading(
      this.deviceService.updateDevice(this.device.uuid, UpdateDeviceToDeviceJson(this.device))
    ).subscribe();
  }

  async presentAirlyPrompt() {
    const alert = await this.alertController.create({
      header: 'Airly api key',
      inputs: [
        {
          name: 'airly_api_key',
          type: 'text',
          placeholder: 'Airly api key',
          value: this.device.airlyApiKey
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Save',
          handler: (data: { airly_api_key: string }) => {
            this.device.airlyApiKey = data.airly_api_key;
            this.save();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentNamePrompt() {
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
            if(data.name){
              this.device.name = data.name;
              this.save();
            } else {
              this.presentToast("Name can't be empty");
              return false;
            }

          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async presentDeleteDeviceConfirm() {
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
            this.deviceService.deleteDevice(this.device.uuid).subscribe(() => {
              this.router.navigate(['/tabs/tab1']);
            });
          }
        }
      ]
    })

    await alert.present();
  }

}
