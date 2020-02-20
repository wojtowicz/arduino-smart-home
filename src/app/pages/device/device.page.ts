import { Component, OnInit } from '@angular/core';
import { DeviceService } from 'src/app/services/device.service';
import { ActivatedRoute } from '@angular/router';
import { GuiHelper } from 'src/app/helpers/gui.helper';

import { Device } from '../../models/device'
import { Subscription, interval } from 'rxjs';
import { tap } from 'rxjs/operators';

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

  constructor(
    private deviceService: DeviceService,
    private route: ActivatedRoute,
    private guiHelper: GuiHelper
  ) { }

  ngOnInit() {
    this.uuid = this.route.snapshot.paramMap.get('uuid');
    this.guiHelper.wrapLoading(
      this.deviceService.getDevice(this.uuid)
    ).subscribe(device => {
      this.device = device;
      this.subscribeConfiguringDevices();
    });
  }

  ngOnDestroy() {
    this.configuring.unsubscribe();
  }

  subscribeConfiguringDevices(): void {
    this.configuring = interval(3000)
      .subscribe(_i => this.checkConfiguringDevice());
  }

  checkConfiguringDevice(): void {
    console.log(this.device.isConfiguring())
    if (this.device.isConfiguring()) {
      this.getDevice(true);
    }
  }

  getDevice(loading: boolean): void {
    this.loading = loading;
    this.deviceService.getDevice(this.uuid)
      .pipe(
          tap(device => this.loading = false)
        )
      .subscribe(device => this.device = device);
  }

  doRefresh(event: CustomEvent): void {
    this.deviceService.getDevice(this.uuid)
      .pipe(
        tap(device => event.detail.complete())
      )
    .subscribe(device => this.device = device);
  }

}
