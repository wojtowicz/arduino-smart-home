import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectWifiModalPageRoutingModule } from './connect-wifi-modal-routing.module';

import { ConnectWifiModalPage } from './connect-wifi-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectWifiModalPageRoutingModule
  ],
  declarations: [ConnectWifiModalPage]
})
export class ConnectWifiModalPageModule {}
