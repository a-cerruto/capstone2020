import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ToastService } from '../../global/toast.service';
import { LoadingService } from '../../global/loading.service';
import { FormService } from '../../global/form.service';
import { AuthenticationService } from '../../account/authentication/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  private registerForm: FormGroup;
  private validationMessages: any;
  private buttonPressed: boolean;
  private accountCreated: boolean;

  constructor(
      private router: Router,
      private toastService: ToastService,
      private loadingService: LoadingService,
      private authentication: AuthenticationService
  ) {
    this.registerForm = FormService.registerForm();
    this.validationMessages = FormService.validationMessages();
    this.buttonPressed = false;
    this.accountCreated = false;
  }

  ngOnInit() {
  }

  ionViewWillLeave() {
    this.toastService.dismiss().then(() => {
      if (this.accountCreated) {
        this.toastService.showRegisterSuccess();
      }
    });
  }

  async register(form) {
    this.buttonPressed = true;
    await this.loadingService.getLoading('Creating Account...');
    const user = form.value;
    user.password = user.password.set;

    this.authentication.register(user).subscribe({
      next: async res => {
        console.log(res);
        this.accountCreated = true;
        await this.router.navigateByUrl('login').then(() => {
          this.loadingService.dismiss();
        });
      },
      error: async err => {
        console.log(err.status);
        this.loadingService.dismiss().then(() => {
          this.toastService.showError(err.status);
          this.buttonPressed = false;
        });
    }
    });
  }
}
