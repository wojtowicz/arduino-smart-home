import { Injectable } from '@angular/core';
import { IDataSource } from 'src/app/interfaces/data-source.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { shareReplay, retryWhen, delayWhen, map, tap } from 'rxjs/operators';
import { timer, Observable } from 'rxjs';
import { DeviceInfoJson, DeviceInfo, DeviceInfoAdapter } from 'src/app/models/device-info';
import { IHttpOptions } from 'src/app/interfaces/http-options.interface';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  dataSources: IDataSource = {
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

  getInfo(): Observable<DeviceInfo> {
    return this.http.get(this.url(), this.httpOptions).pipe(
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

}
