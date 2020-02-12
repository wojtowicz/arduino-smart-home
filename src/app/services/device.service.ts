import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { catchError, shareReplay, retryWhen, delayWhen, tap } from 'rxjs/operators';

import { Device } from '../models/device';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  dataSources = {
    'local': 'api/devices',
    'remote': 'devices',
    'localhost': 'devices',
  }

  dataSourceFormats = {
    'local': '',
    'remote': '.json',
    'localhost': '.json',
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  url(uuid: string = ''){
    return [
      environment.apiBaseUrl,
      this.dataSources[environment.dataSource],
      uuid
    ].filter(Boolean).join('/') + this.dataSourceFormats[environment.dataSource];
  }

  createDevice(device: Device): Observable<Device> {
    return this.http.put<Device>(this.url(device.uuid), device, this.httpOptions).pipe(
      shareReplay(),
      retryWhen(errors => {
        return errors
                .pipe(
                    delayWhen(() => timer(1000)),
                    tap(() => console.log('retrying...'))
                );
      }),
      catchError(this.handleError<Device>('updateDevice'))
    );
  }

  updateDevice(device: Device): Observable<Device> {
    return this.http.put<Device>(this.url(device.uuid), device, this.httpOptions).pipe(
      catchError(this.handleError<Device>('updateDevice'))
    );
  }

  getDevices (): Observable<Device[]> {
    return this.http.get<Device[]>(this.url())
      .pipe(
        catchError(this.handleError<Device[]>('getDevices', []))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
