import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { catchError, shareReplay, retryWhen, delayWhen, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { WifiNetwork, WifiNetworkJson, WifiNetworkAdapter } from '../../models/wifi_network';

import { IDataSource } from '../../interfaces/data-source.interface';
import { IHttpOptions } from '../../interfaces/http-options.interface';

@Injectable({
  providedIn: 'root'
})
export class WifiNetworkService {

  defaultLocalIp = '192.168.4.1';

  dataSources: IDataSource = {
    local: 'api/wifiNetworks',
    remote: 'http://:local_ip/wifi_networks',
    localhost: 'api/wifiNetworks',
  };

  httpOptions: IHttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  url(localIp: string): string {
    return this.dataSources[environment.dataSource].replace(':local_ip', localIp || this.defaultLocalIp);
  }

  getWifiNetworks(localIp: string): Observable<WifiNetwork[]> {
    return this.http.get(this.url(localIp), this.httpOptions).pipe(
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

  connect(ssid: string, password: string, localIp: string): Observable<unknown> {
    return this.http.post(this.url(localIp) + '/connect', { ssid, password }, this.httpOptions).pipe(
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

  disconnect(localIp: string): Observable<unknown> {
    return this.http.post(this.url(localIp) + '/disconnect', {}, this.httpOptions).pipe(
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
