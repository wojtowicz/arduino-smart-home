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
    'remote': '/devices'
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  url(){
    return environment.apiBaseUrl + this.dataSources[environment.dataSource]
  }

  addDevice(device: Device): Observable<Device> {
    return this.http.post<Device>(this.url(), device, this.httpOptions).pipe(
      catchError(this.handleError<Device>('addDevice'))
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
