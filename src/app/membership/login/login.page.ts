import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ToastService } from '../../global/services/toast.service';
import { LoadingService } from '../../global/services/loading.service';
import { FormService } from '../../global/services/form.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { UserService } from '../authentication/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  private loginSubscription: any;
  private loginForm: FormGroup;
  private validationMessages: any;
  private buttonPressed: boolean;
  private backdrop: boolean;

  constructor(
      private router: Router,
      private loadingService: LoadingService,
      private toastService: ToastService,
      private authentication: AuthenticationService,
      private user: UserService
  ) {
    this.loginForm = FormService.loginForm();
    this.validationMessages = FormService.validationMessages();
    this.buttonPressed = false;
    this.backdrop = true;
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.buttonPressed = false;
    this.backdrop = true;
    if (this.user.isLoggedIn()) {
      this.router.navigateByUrl('').then();
    } else {
      this.loadingService.getLoading().then(() => {
        this.authentication.checkStorage().then((loggedIn) => {
          loggedIn ? this.router.navigateByUrl('').then(() => { console.log('#4.5'); }) : this.backdrop = false;
          this.loadingService.dismiss().then();
        });
      });
    }
  }

  login(form) {
    this.buttonPressed = true;

    this.loadingService.getLoading('Logging in...').then(() => {
      this.loginSubscription = this.user.login(form).subscribe({
        next: async res => {
          console.log(res);
          await this.loadingService.dismiss();
          await this.router.navigateByUrl('');
        },
        error: err => {
          console.log(err.status);
          this.loadingService.dismiss().then(() => {
            this.toastService.showError(err.status);
            this.buttonPressed = false;
          });
        }
      });
    });

  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

}
