import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'devices/scan',
    loadChildren: () => import('./pages/devices-scan/devices-scan.module').then( m => m.DevicesScanPageModule)
  },
  {
    path: 'devices/:uuid/wifi_networks',
    loadChildren: () => import('./pages/wifi-networks/wifi-networks.module').then( m => m.WifiNetworksPageModule)
  },
  {
    path: 'devices/:uuid',
    loadChildren: () => import('./pages/device/device.module').then( m => m.DevicePageModule)
  },




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
