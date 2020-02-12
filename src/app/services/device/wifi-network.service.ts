import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { catchError, shareReplay, retryWhen, delayWhen, tap, map, toArray } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { WifiNetwork, WifiNetworkJson, WifiNetworkAdapter } from '../../models/wifi_network';
import { DeviceInfo, DeviceInfoJson, DeviceInfoAdapter } from 'src/app/models/device-info';

import { IDataSource } from '../../interfaces/data-source.interface';
import { IHttpOptions } from '../../interfaces/http-options.interface';

@Injectable({
  providedIn: 'root'
})
export class WifiNetworkService {
  dataSources: IDataSource = {
    local: 'api/wifiNetworks',
    remote: 'http://192.168.4.1/wifi_networks',
    localhost: 'api/wifiNetworks',
  };

  infoDataSources: IDataSource = {
    local: 'api/info',
    remote: 'http://192.168.4.1/info',
    localhost: 'api/info',
  };

  httpOptions: IHttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  url(): string {
    return this.dataSources[environment.dataSource];
  }

  infoUrl(): string {
    return this.infoDataSources[environment.dataSource];
  }

  getWifiNetworks(): Observable<WifiNetwork[]> {
    return this.http.get(this.url(), this.httpOptions).pipe(
      shareReplay(),
      retryWhen(errors => {
        return errors
                .pipe(
                    delayWhen(() => timer(1000)),
                    tap(() => console.log('retrying...'))
                );
      }),
      map((data: WifiNetworkJson[]) => data.map(item => WifiNetworkAdapter(item)))
    );
  }

  getInfo(): Observable<DeviceInfo> {
    return this.http.get(this.infoUrl(), this.httpOptions).pipe(
      shareReplay(),
      retryWhen(errors => {
        return errors
                .pipe(
                    delayWhen(() => timer(1000)),
                    tap(() => console.log('retrying...'))
                );
      }),
      map((json: DeviceInfoJson) => DeviceInfoAdapter(json)),
    );
  }

  connect(ssid: string, password: string): Observable<unknown> {
    return this.http.post(this.url() + '/connect', { ssid, password }, this.httpOptions).pipe(
      shareReplay(),
      retryWhen(errors => {
        return errors
                .pipe(
                    delayWhen(() => timer(1000)),
                    tap(() => console.log('retrying...'))
                );
      }),
      catchError(this.handleError('wifi_networks/connect'))
    );
  }

  disconnect(): Observable<unknown> {
    return this.http.post(this.url() + '/disconnect', {}, this.httpOptions).pipe(
      shareReplay(),
      retryWhen(errors => {
        return errors
                .pipe(
                    delayWhen(() => timer(1000)),
                    tap(() => console.log('retrying...'))
                );
      }),
      catchError(this.handleError('wifi_networks/disconnect'))
    );
  }

  private handleError<T>(operation: string = 'operation', result?: T): (error: Error | HttpErrorResponse) => Observable<T> {
    return (error: Error | HttpErrorResponse): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
