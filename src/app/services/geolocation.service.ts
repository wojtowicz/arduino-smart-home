import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { Observable, from, of, timer } from 'rxjs';
import { catchError, flatMap, shareReplay, retryWhen, delayWhen, tap } from 'rxjs/operators';
import { Coords } from '../models/coords';

import { OpenStreetMapProvider } from 'leaflet-geosearch';


@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private geolocation: Geolocation) { }

  getCurrentPosition(): Observable<Coords> {
    return new Observable(subscriber => {
      from(this.geolocation.getCurrentPosition()).pipe(
        catchError(_error => {
          return of({ coords: { latitude: undefined, longitude: undefined } });
        }),
        flatMap((resp) => {
          return this.getCoordsLabel(resp.coords.latitude, resp.coords.longitude).pipe(
            shareReplay(),
            retryWhen(errors => {
              return errors
                      .pipe(
                          delayWhen(() => timer(1000)),
                          tap(() => console.log('retrying...'))
                      );
            }),
          )
        }),
      )
      .subscribe(coords => {
        subscriber.next(coords);
        subscriber.complete();
      })
    });
  }

  getCoordsLabel(lat: number, lng: number): Observable<Coords> {
    return new Observable(subscriber => {
    const provider = new OpenStreetMapProvider();
    from(provider.search({ query: lat + ' ' + lng }))
      .subscribe((result: { label: string }[]) => {
        const coordsData = result[0];
        let label = '';
        if(coordsData) label = coordsData.label;
        subscriber.next(new Coords(lat, lng, label));
        subscriber.complete();
      });
    });
  }
}
