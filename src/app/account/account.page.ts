import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FormGroup } from '@angular/forms';
import { LoadingService } from '../global/services/loading.service';
import { ToastService } from '../global/services/toast.service';
import { FormService } from '../global/services/form.service';
import { AccountService } from './account.service';
import { UserService } from '../membership/authentication/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  private emailForm: FormGroup;
  private usernameForm: FormGroup;
  private passwordForm: FormGroup;
  private validationMessages: any;
  private edit: boolean;
  private editEmail: boolean;
  private editUsername: boolean;
  private editPassword: boolean;
  private buttonPressed: boolean;

  constructor(
    private router: Router,
    private storage: Storage,
    private loading: LoadingService,
    private toast: ToastService,
    private account: AccountService,
    private user: UserService
  ) {
    this.emailForm = FormService.emailForm();
    this.usernameForm = FormService.usernameForm();
    this.passwordForm = FormService.passwordForm();
    this.validationMessages = FormService.validationMessages();
    this.edit = false;
    this.editEmail = false;
    this.editUsername = false;
    this.editPassword = false;
    this.buttonPressed = false;
  }

  ngOnInit() {
  }

  toggleEdit() {
    if (this.edit) { this.resetButtons(); } else { this.edit = true; }
  }

  canEditEmail() {
    this.editEmail = !this.editEmail;
  }

  canEditUsername() {
    this.editUsername = !this.editUsername;
  }

  canEditPassword() {
    this.editPassword = !this.editPassword;
  }

  resetButtons() {
    this.edit = this.editEmail = this.editUsername = this.editPassword = this.buttonPressed = false;
  }

  async updateEmail(form) {
    this.buttonPressed = true;
    await this.loading.getLoading('Updating Email...');
    const value = form.value;
    const id = this.user.getId();
    this.account.updateEmail({value, id}).subscribe( {
      next: async res => {
        console.log(res);
        this.loading.dismiss().then(() => {
          this.router.navigateByUrl('/account');
          this.toast.showSuccess('Email has been updated to ' + value.email);
          this.resetButtons();
        });
      },
      error: async err => {
        console.log(err.status);
        this.loading.dismiss().then(() => {
          this.toast.showError(err.status);
          this.buttonPressed = false;
        });
      }
    });
  }

  async updateUsername(form) {
    this.buttonPressed = true;
    await this.loading.getLoading('Updating Username...');
    const value = form.value;
    const id = this.user.getId();
    this.account.updateUsername({value, id}).subscribe({
      next: async res => {
        console.log(res);
        this.loading.dismiss().then(() => {
          this.router.navigateByUrl('/account');
          this.toast.showSuccess('Username has been updated to ' + value.username);
          this.resetButtons();
        });
      },
      error: async err => {
        console.log(err.status);
        this.loading.dismiss().then(() => {
          this.toast.showError(err.status);
          this.buttonPressed = false;
        });
      }
    });
  }

  async updatePassword(form) {
    this.buttonPressed = true;
    await this.loading.getLoading('Updating Password');
    const value = form.value;
    const id = this.user.getId();
    this.account.updatePassword({value, id}).subscribe({
      next: async res => {
        console.log(res);
        this.loading.dismiss().then(() => {
          this.router.navigateByUrl('/account').then(() => {
            this.toast.showSuccess('Password has been successfully updated!');
            this.resetButtons();
          });
        });
      },
      error: async err => {
        console.log(err.status);
        this.loading.dismiss().then(() => {
          this.toast.showError(err.status);
          this.buttonPressed = false;
        });
      }
    });
  }

}
