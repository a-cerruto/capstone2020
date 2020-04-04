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
  private browserSettings: SettingsBrowse;

  private readonly userKey: string;
  private readonly browserSettingsKey: string;


  constructor(
      private router: Router,
      private storage: Storage,
      private loading: LoadingService,
      private toast: ToastService,
      private authentication: AuthenticationService,
      private settings: SettingsService
  ) {
    this.userKey = 'USER';
    this.browserSettingsKey = 'BROWSER_SETTINGS';

    this.authentication.isLoggedIn().subscribe(async loggedIn => {
      console.log('User is logged in: ' + loggedIn);
      this.loggedIn = loggedIn;
      if (this.loggedIn) {
        this.getDetails();
      }
    });
  }

  login(form) {
    return this.authentication.login(form.value);
  }

  async logout() {
    await this.loading.getLoading('Logging out...');
    await this.storage.remove(this.browserSettingsKey);
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
      while (!user) { user = await this.storage.get(this.userKey); }
      this.id = user.id;
      this.email = user.email;
      this.username = user.username;
      console.log('user: ' + user);
      console.log('id: ' + this.id);
      console.log('email: ' + this.email);
      console.log('username: ' + this.username);

      this.fetchBrowserSettings();

    });
  }

  async fetchBrowserSettings() {
    this.settings.getBrowserSettings(this.id).subscribe({
      next: res => {
        let settings;
        this.storage.ready().then(async () => {
          settings = await this.storage.get(this.browserSettingsKey);
          this.browserSettings = settings;
          console.log(this.browserSettings);
        });
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

  getUsername() {
    return this.username;
  }

  getBrowserSettings() {
    return this.browserSettings;
  }

}
