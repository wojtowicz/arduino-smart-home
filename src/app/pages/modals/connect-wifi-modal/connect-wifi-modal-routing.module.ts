import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectWifiModalPage } from './connect-wifi-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectWifiModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectWifiModalPageRoutingModule {}
