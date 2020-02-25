import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevicePageRoutingModule } from './device-routing.module';

import { DevicePage } from './device.page';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ConnectWifiModalPageModule } from '../modals/connect-wifi-modal/connect-wifi-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevicePageRoutingModule,
    LeafletModule,
    ConnectWifiModalPageModule,
  ],
  declarations: [DevicePage]
})
export class DevicePageModule {}
