import { Injectable } from '@angular/core';
import { LoadingController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private lc: LoadingController) { }

  async dismiss() {
    try {
      await this.lc.dismiss();
    } catch (e) {}
  }

  async getLoading(msg= 'loading') {
    await this.lc.create({
      message: msg
    }).then((loading) => {
      loading.present();
    });
  }
}
