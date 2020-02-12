import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';

import { Camera } from '@ionic-native/camera/ngx';
import { Network } from '@ionic-native/network/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';
import { DeviceConnectService } from './services/device-connect.service';
import { DeviceConnectFactory } from './factories/device-connect.factory';
import { WifiDeviceFactory } from './factories/wifi-device.factory';
import { environment } from 'src/environments/environment';
import { WifiDeviceService } from './services/wifi-device.service';
import { WifiNetworkService } from './services/device/wifi-network.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    HttpClientModule, IonicStorageModule.forRoot(), FormsModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, {
        dataEncapsulation: false, delay: 1500, passThruUnknownUrl: true
      }
    )
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: DeviceConnectService, useFactory: DeviceConnectFactory, deps: ['DATA_SOURCE'] },
    { provide: WifiDeviceService, useFactory: WifiDeviceFactory, deps: ['DATA_SOURCE', Network, WifiNetworkService] },
    { provide: 'DATA_SOURCE', useValue: environment.dataSource }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
