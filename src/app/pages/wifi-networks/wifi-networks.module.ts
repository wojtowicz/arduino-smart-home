import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WifiNetworksPageRoutingModule } from './wifi-networks-routing.module';

import { WifiNetworksPage } from './wifi-networks.page';
import { ConnectWifiModalPageModule } from '../../connect-wifi-modal/connect-wifi-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WifiNetworksPageRoutingModule,
    ConnectWifiModalPageModule
  ],
  declarations: [WifiNetworksPage]
})
export class WifiNetworksPageModule {}
