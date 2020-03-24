import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ToastService } from '../../global/toast.service';
import { LoadingService } from '../../global/loading.service';
import { FormService } from '../../global/form.service';
import { UserService } from '../../account/authentication/user.service';

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
      this.router.navigateByUrl('/tabs/home');
    }
  }

  ionViewWillLeave() {
    this.toastService.dismiss();
    this.loadingService.dismiss();
  }

  async login(form) {
    this.buttonPressed = true;

    await this.loadingService.getLoading('Logging in...');

    this.user.login(form).subscribe({
      next: res => {
        console.log(res);
        this.router.navigateByUrl('/tabs/home');
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
