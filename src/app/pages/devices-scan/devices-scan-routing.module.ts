import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevicesScanPage } from './devices-scan.page';

const routes: Routes = [
  {
    path: '',
    component: DevicesScanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevicesScanPageRoutingModule {}
