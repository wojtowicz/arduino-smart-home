import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { from, Observable } from 'rxjs';
import { tap, flatMap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuiHelper {

  constructor(public loadingController: LoadingController) { }

  public wrapLoading<T>(source: Observable<T>): Observable<T> {
    let loader: any;

    const obs = from(this.loadingController.create({
        message: 'Please wait ...'
    }));

    const wrapper = obs.pipe(
        tap(loader2 => {
            loader = loader2;
            loader2.present();
        }),
        flatMap(() => source),
        finalize(() => {
            loader.dismiss();
        })
    );

    return wrapper;
}
}
