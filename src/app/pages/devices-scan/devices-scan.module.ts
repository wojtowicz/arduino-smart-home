import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevicesScanPageRoutingModule } from './devices-scan-routing.module';

import { DevicesScanPage } from './devices-scan.page';
import { DeviceConnectModalPageModule } from '../modals/device-connect-modal/device-connect-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevicesScanPageRoutingModule,
    DeviceConnectModalPageModule
  ],
  declarations: [DevicesScanPage]
})
export class DevicesScanPageModule {}
