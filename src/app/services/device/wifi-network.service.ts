import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { catchError, shareReplay, retryWhen, delayWhen, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WifiNetworkService {
  dataSources = {
    local: 'api/wifiNetworks',
    remote: 'http://192.168.4.1/wifi_networks',
    localhost: 'api/wifiNetworks',
  };

  infoDataSources = {
    local: 'api/info',
    remote: 'http://192.168.4.1/info',
    localhost: 'api/info',
  };

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  url() {
    return this.dataSources[environment.dataSource];
  }

  infoUrl() {
    return this.infoDataSources[environment.dataSource];
  }

  getWifiNetworks() {
    return this.http.get(this.url(), this.httpOptions).pipe(
      shareReplay(5),
      retryWhen(errors => {
        return errors
                .pipe(
                    delayWhen(() => timer(1000)),
                    tap(() => console.log('retrying...'))
                );
      })
    );
  }

  getInfo() {
    return this.http.get(this.infoUrl(), this.httpOptions).pipe(
      shareReplay(),
      retryWhen(errors => {
        return errors
                .pipe(
                    delayWhen(() => timer(1000)),
                    tap(() => console.log('retrying...'))
                );
      })
    );
  }

  connect(ssid: string, password: string): Observable<any> {
    return this.http.post(this.url() + '/connect', {ssid, password}, this.httpOptions).pipe(
      shareReplay(),
      retryWhen(errors => {
        return errors
                .pipe(
                    delayWhen(() => timer(1000)),
                    tap(() => console.log('retrying...'))
                );
      }),
      catchError(this.handleError<any>('wifi_networks/connect'))
    );
  }

  disconnect(): Observable<any> {
    return this.http.post(this.url() + '/disconnect', {}, this.httpOptions).pipe(
      shareReplay(),
      retryWhen(errors => {
        return errors
                .pipe(
                    delayWhen(() => timer(1000)),
                    tap(() => console.log('retrying...'))
                );
      }),
      catchError(this.handleError<any>('wifi_networks/disconnect'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
