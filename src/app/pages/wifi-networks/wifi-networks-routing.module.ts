import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WifiNetworksPage } from './wifi-networks.page';

const routes: Routes = [
  {
    path: '',
    component: WifiNetworksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WifiNetworksPageRoutingModule {}
