import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeviceConnectModalPage } from './device-connect-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DeviceConnectModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceConnectModalPageRoutingModule {}
