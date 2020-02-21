import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeviceConnectModalPageRoutingModule } from './device-connect-modal-routing.module';

import { DeviceConnectModalPage } from './device-connect-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeviceConnectModalPageRoutingModule
  ],
  declarations: [DeviceConnectModalPage],
  entryComponents: [DeviceConnectModalPage],
})
export class DeviceConnectModalPageModule {}
