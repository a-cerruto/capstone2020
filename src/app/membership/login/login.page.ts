import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ToastService } from '../../global/services/toast.service';
import { LoadingService } from '../../global/services/loading.service';
import { FormService } from '../../global/services/form.service';
import { UserService } from '../authentication/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private loginForm: FormGroup;
  private validationMessages: any;
  private buttonPressed: boolean;

  constructor(
      private router: Router,
      private loadingService: LoadingService,
      private toastService: ToastService,
      private user: UserService
  ) {
    this.loginForm = FormService.loginForm();
    this.validationMessages = FormService.validationMessages();
    this.buttonPressed = false;
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.user.isLoggedIn()) {
      this.router.navigateByUrl('').then();
    }
  }

  ionViewWillLeave() {
    this.toastService.dismiss().then();
    this.loadingService.dismiss().then();
  }

  async login(form) {
    this.buttonPressed = true;

    await this.loadingService.getLoading('Logging in...');

    this.user.login(form).subscribe({
      next: res => {
        console.log(res);
        this.router.navigateByUrl('');
      },
      error: err => {
        console.log(err.status);
        this.loadingService.dismiss().then(() => {
          this.toastService.showError(err.status);
          this.buttonPressed = false;
        });
      }
    });
  }

}
