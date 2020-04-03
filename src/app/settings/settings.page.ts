import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FormGroup } from '@angular/forms';

import { LoadingService } from '../global/services/loading.service';
import { ToastService } from '../global/services/toast.service';
import { FormService } from '../global/services/form.service';

import { AccountService } from './account.service';
import { SettingsService } from './settings.service';
import { UserService } from '../membership/authentication/user.service';

import { SettingsBrowse } from './interfaces/settings-browse';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  // Slide #1
  private slideOptions: any;
  private customizeChannels: boolean;
  private channelOptions = ['All', 'Subscriptions Only', 'Custom'];
  private channelList = ['Amazon Prime', 'Netflix', 'Hulu', 'HBO'];
  private sourceOptions = ['Free', 'Tv Everywhere', 'Subscription', 'Purchase'];
  private platformOptions = ['Web', 'iOS', 'Android'];
  private browseSettings: SettingsBrowse;

  // Slide #2
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
    private storage: Storage,
    private loading: LoadingService,
    private toast: ToastService,
    private account: AccountService,
    private settings: SettingsService,
    private user: UserService
  ) {
    // Slide #1
    this.customizeChannels = false;
    this.slideOptions = {
      slidesPerView: 1,
      spaceBetween: 0
    };
    // Slide #2
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
    this.browseSettings = this.user.getBrowserSettings();
  }

  // Slide #1

  changeSlide(value) {
    console.log(value);
  }

  test(ev) {
    console.log(ev);
  }

  channelSelection(value) {
    if (value === this.channelOptions[2]) {
      this.customizeChannels = true;
    }
  }

  // Slide #2
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
          this.toast.showSuccess('Password has been successfully updated!');
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

}
