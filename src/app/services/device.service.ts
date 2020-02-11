import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Device } from '../models/device';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  dataSources = {
    'local': 'api/devices',
    'remote': '/devices',
    'localhost': '/devices',
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  url(){
    return environment.apiBaseUrl + this.dataSources[environment.dataSource]
  }

  updateDeviceUrl(uuid: string){
    return this.url() + '/' + uuid + '.json';
  }

  devicesUrl(){
    return this.url() + '.json';
  }

  updateDevice(device: Device): Observable<Device> {
    device.sync_at = null;
    return this.http.put<Device>(this.updateDeviceUrl(device.uuid), device, this.httpOptions).pipe(
      catchError(this.handleError<Device>('updateDevice'))
    );
  }

  getDevices (): Observable<Device[]> {
    return this.http.get<Device[]>(this.devicesUrl())
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
