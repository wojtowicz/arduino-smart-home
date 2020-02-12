import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Device } from '../models/device';
import { DeviceService } from '../services/device.service';
import { tap } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  devices: Device[];
  loading = false;
  configuringDevices: Subscription;

  constructor(
    private deviceService: DeviceService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    route.params.subscribe(val => {
      this.getDevices(true);
      this.subscribeConfiguringDevices();
    });
  }

  onAddDevice() {
    this.unsubscribeConfiguringDevices();
    this.router.navigate(['/devices/scan']);
  }

  subscribeConfiguringDevices() {
    this.configuringDevices = interval(3000)
      .subscribe(i => this.checkConfiguringDevice(i));
  }

  unsubscribeConfiguringDevices() {
    this.configuringDevices.unsubscribe();
  }

  checkConfiguringDevice(i: number) {
    const configuringDevices = this.devices.filter(device => {
      return device.status.includes('configuring');
    });
    if (configuringDevices.length > 0) {
      this.getDevices(true);
    }
  }

  getDevices(loading: boolean): void {
    this.loading = loading;
    this.deviceService.getDevices()
      .pipe(
          tap(devices => this.loading = false)
        )
      .subscribe(devices => this.devices = devices);
  }

  doRefresh(event) {
    this.deviceService.getDevices()
      .pipe(
        tap(devices => event.target.complete())
      )
    .subscribe(devices => this.devices = devices);
  }

}
