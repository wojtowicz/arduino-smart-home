import { Component } from '@angular/core';

import { Device } from '../models/device';
import { DeviceService } from '../services/device.service';
import { GuiHelper } from '../helpers/gui.helper';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  devices: Device[];

  constructor(
    private deviceService: DeviceService, private guiHelper: GuiHelper
  ) {}

  ngOnInit() {
    this.getDevices();
  }

  getDevices(): void {
    this.guiHelper.wrapLoading(
      this.deviceService.getDevices()
    ).subscribe(devices => this.devices = devices);
  }

}
