import { Component } from '@angular/core';

import { Device } from '../models/device';
import { DeviceService } from '../services/device.service';
import { GuiHelper } from '../helpers/gui.helper';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  devices: Device[];
  loading: boolean = false;

  constructor(
    private deviceService: DeviceService, private guiHelper: GuiHelper
  ) {}

  ngOnInit() {
    this.getDevices();
  }

  getDevices(): void {
    this.loading = true;
    this.deviceService.getDevices()
      .pipe(
          tap(devices => this.loading = false)
        )
      .subscribe(devices => this.devices = devices);
    // this.guiHelper.wrapLoading(
    //   this.deviceService.getDevices()
    // ).subscribe(devices => this.devices = devices);
  }

  doRefresh(event) {
    this.deviceService.getDevices()
      .pipe(
        tap(devices => event.target.complete())
      )
    .subscribe(devices => this.devices = devices);
  }

}
