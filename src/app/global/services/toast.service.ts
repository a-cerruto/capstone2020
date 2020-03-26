import { Injectable } from '@angular/core';
import { ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private tc: ToastController) { }

  async dismiss() {
    try {
      await this.tc.dismiss();
    } catch (e) {}
  }

  showRegisterSuccess() {
    this.dismiss().then(() => {
      this.tc.create({
        message: 'Account creation successful!',
        duration: 5000,
        position: 'top',
        color: 'success'
      }).then(toastData => {
        toastData.present();
      });
    });
  }

  showError(errStatus) {
    let message;
    switch (errStatus) {
      case 401:
      case 404:
        message = 'Email and/or Password is incorrect';
        break;
      case 409:
        message = 'Email has already been registered!';
        break;
      case 500:
        message = 'Server Error!';
    }

    this.dismiss().then(() => {
      this.tc.create({
        message,
        position: 'top',
        color: 'danger'
      }).then(toast => {
        toast.present();
      });
    });
  }
}
