import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FormGroup } from '@angular/forms';

import { LoadingService } from '../global/services/loading.service';
import { ToastService } from '../global/services/toast.service';
import { FormService } from '../global/services/form.service';

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
  private customChannels: boolean;
  private channelList = [
    {
      key: 'All',
      value: 'all',
    },
    {
      key: 'Subscriptions Only',
      value: 'subscription'
    },
    {
      key: 'Custom',
      value: 'custom'
    }
  ];

  private channelOptions = ['amazon_prime', 'netflix', 'hulu', 'hbo'];
  private sourceOptions = ['free', 'tv_everywhere', 'subscription', 'purchase'];
  private platformOptions = ['web', 'ios', 'android'];
  private userBrowseSettings: SettingsBrowse;

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
    private user: UserService
  ) {
    // Slide #1
    this.slideOptions = {
      slidesPerView: 2,
      spaceBetween: 0,
      breakpoints: {
        750: {
          slidesPerView: 1
        }
      }
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
    this.loading.getLoading().then(() => {
      if (this.user.areSettingsStored()) {
        this.userBrowseSettings = this.user.getBrowseSettings();
        this.loading.dismiss().then();
      }
      this.user.areSettingsStored().subscribe(async stored => {
        if (stored) {
          this.userBrowseSettings = this.user.getBrowseSettings();
          this.loading.dismiss().then();
        }
      });
    });
  }

  // Slide #1

  updateSettings(key, value) {
    this.user.setBrowseSettings(key, value.toString()).subscribe({
      next: res => {
        console.log(res);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  async refreshSettings(event) {
    await this.user.fetchSettings();
    event.target.complete();
  }

  channelSelection(listType) {
    switch (listType) {
      case this.channelList[0].value:
        this.customizeChannels = false;
        this.updateSettings('channelList', 'all');
        this.updateSettings('channels', 'all');
        break;
      case this.channelList[1].value:
        this.customizeChannels = false;
        this.updateSettings('channelList', 'subscriptions');
        break;
      case this.channelList[2].value:
        this.customizeChannels = true;
        this.updateSettings('channelList', 'custom');
        break;
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
    this.user.setEmail(form.value).subscribe( {
      next: async res => {
        console.log(res);
        this.loading.dismiss().then(() => {
          this.toast.showSuccess('Email has been updated to ' + res.email);
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
    this.user.setUsername(form.value).subscribe({
      next: async res => {
        console.log(res);
        this.loading.dismiss().then(() => {
          this.toast.showSuccess('Username has been updated to ' + res.username);
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
    this.user.setPassword(form.value).subscribe({
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
