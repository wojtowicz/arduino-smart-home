import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Device } from '../models/device';
// import { DEVICES } from '../mocks/mock-devices';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private url = 'http://localhost:3000';
  private devicesUrl = 'api/devices';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  // getDevices (): Observable<any> {
  //   return this.http.get(this.url + "/devices", this.httpOptions).pipe(
  //     catchError(this.handleError<any>('getDevices'))
  //   );
  // }

  // getDevices(): Observable<Device[]> {
  //   return of(DEVICES);
  // }

  getDevices (): Observable<Device[]> {
    return this.http.get<Device[]>(this.devicesUrl)
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
