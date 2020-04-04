import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Storage } from '@ionic/storage';

import { LoadingService} from '../../global/services/loading.service';
import { ToastService } from '../../global/services/toast.service';
import { AuthenticationService } from './authentication.service';
import { SettingsService } from '../../settings/settings.service';

import { SettingsBrowse } from '../../settings/interfaces/settings-browse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private loggedIn = false;

  private id: number;
  private email: string;
  private username: string;
  private browseSettings: SettingsBrowse;

  private readonly userKey: string;
  private readonly browseSettingsKey: string;


  constructor(
      private router: Router,
      private storage: Storage,
      private loading: LoadingService,
      private toast: ToastService,
      private authentication: AuthenticationService,
      private settings: SettingsService
  ) {
    this.userKey = 'USER';
    this.browseSettingsKey = 'BROWSE_SETTINGS';

    this.authentication.isLoggedIn().subscribe(async loggedIn => {
      console.log('User is logged in: ' + loggedIn);
      this.loggedIn = loggedIn;
      if (this.loggedIn) {
        this.getDetails();
      }
    });

    this.settings.browseSettingsStored().subscribe(async stored => {
      if (stored) {
        await this.storage.ready();
        this.browseSettings = await this.storage.get(this.browseSettingsKey);
      }
    });
  }

  login(form) {
    return this.authentication.login(form.value);
  }

  async logout() {
    await this.loading.getLoading('Logging out...');
    await this.storage.remove(this.browseSettingsKey);
    await this.authentication.logout();
    await this.loading.dismiss();
    await this.router.navigateByUrl('/login');
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  getDetails() {
    let user;
    this.storage.ready().then(async () => {
      user = await this.storage.get(this.userKey);
      this.id = user.id;
      this.email = user.email;
      this.username = user.username;
      console.log('user: ' + user);
      console.log('id: ' + this.id);
      console.log('email: ' + this.email);
      console.log('username: ' + this.username);

      this.initBrowserSettings();

    });
  }

  async initBrowserSettings() {
    this.settings.getBrowseSettings(this.id).subscribe({
      next: res => {
        console.log(res);
      },
      error: err => {
        console.log(err.status);
        this.toast.showError(err.status);
      }
    });
  }

  getId() {
    return this.id;
  }

  getEmail() {
    return this.email;
  }

  setEmail(value) {
    return this.authentication.updateDetails(this.id, 'email', value);
  }

  getUsername() {
    return this.username;
  }

  setUsername(value) {
    return this.authentication.updateDetails(this.id, 'username', value);
  }

  setPassword(value) {
    return this.authentication.updateDetails(this.id, 'password', value);
  }

  getBrowseSettings() {
    return this.browseSettings;
  }

}
