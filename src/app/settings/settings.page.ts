import { Component, OnInit, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FormGroup } from '@angular/forms';

import { LoadingService } from '../global/services/loading.service';
import { ToastService } from '../global/services/toast.service';
import { FormService } from '../global/services/form.service';

import { SettingsService } from './settings.service';
import { UserService } from '../membership/authentication/user.service';

import { SettingsBrowse } from './interfaces/settings-browse';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  // Slide #1
  private slideOptions = {
    slidesPerView: 2,
    spaceBetween: 0,
    breakpoints: {
      750: {
        slidesPerView: 1
      }
    }
  };
  private channelList = [
    {
      title: 'All',
      value: 'all',
    },
    {
      title: 'Subscriptions Only',
      value: 'subscription'
    },
    {
      title: 'Custom',
      value: 'custom'
    }
  ];
  private showSourceOptions: boolean;

  private channelOptions: any;
  private sourceOptions: any;
  private platformOptions: any;
  private storedSubscription: any;
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
    private settings: SettingsService,
    private user: UserService
  ) {
    // Slide #1
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
      this.settings.getOptions().subscribe({
        next: res => {
          console.log(res);
          if (res) {
            this.channelOptions = res.available_channels;
            this.sourceOptions = res.available_sources;
            this.platformOptions = res.available_platforms;
          }
        },
        error: err => {
          console.log(err.status);
          this.toast.showError(err.status);
        }
      });
      this.storedSubscription = this.user.areSettingsStored().subscribe(async stored => {
        if (stored) {
          this.userBrowseSettings = this.user.getBrowseSettings();
          this.showSourceOptions = this.userBrowseSettings.channelList === this.channelList[2].value;
          this.loading.dismiss().then();
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.storedSubscription) {
      this.storedSubscription.unsubscribe();
    }
  }

  // Slide #1

  updateSettings(key, value) {
    this.user.setBrowseSettings(key, value.toString());
  }

  async refreshSettings(event) {
    await this.user.initSettings();
    event.target.complete();
  }

  channelSelection(listType) {
    switch (listType) {
      case this.channelList[0].value:
        this.updateSettings('channelList', this.channelList[0].value);
        this.showSourceOptions = false;
        let value = '';
        let i = 1;
        this.channelOptions.forEach(channel => {
          value += channel.value;
          if (i !== this.channelOptions.length) {
            value += ',';
          }
          i++;
        });
        this.updateSettings('channels', value);
        this.showSourceOptions = false;
        break;
      case this.channelList[1].value:
        this.updateSettings('channelList', 'subscriptions');
        break;
      case this.channelList[2].value:
        this.updateSettings('channelList', 'custom');
        this.showSourceOptions = true;
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
