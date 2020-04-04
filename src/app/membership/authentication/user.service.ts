import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

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
  private settingsStored = new BehaviorSubject(false);

  private id: number;
  private email: string;
  private username: string;
  private browseSettings: SettingsBrowse;

  private readonly userKey = 'USER';
  private readonly browseSettingsKey = 'BROWSE_SETTINGS';


  constructor(
      private router: Router,
      private storage: Storage,
      private loading: LoadingService,
      private toast: ToastService,
      private authentication: AuthenticationService,
      private settings: SettingsService
  ) {
    this.authentication.isLoggedIn().subscribe(async loggedIn => {
      console.log('User is logged in: ' + loggedIn);
      this.loggedIn = loggedIn;
      if (this.loggedIn) {
         this.initDetails();
      }
    });
    this.settings.areSettingsStored().subscribe(async stored => {
      if (stored) { this.initSettings(); } else { this.settingsStored.next(false); }
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

  initDetails() {
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
      this.fetchSettings();
    });
  }

  initSettings() {
    this.storage.ready().then(async () => {
      this.browseSettings = await this.storage.get(this.browseSettingsKey);
      this.settingsStored.next(true);
      console.log(this.browseSettings);
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

  areSettingsStored() {
    return this.settingsStored.asObservable();
  }

  async fetchSettings() {
    await this.settings.getBrowseSettings(this.id).subscribe({
      next: res => {
        console.log(res);
      },
      error: err => {
        console.log(err.status);
        this.toast.showError(err.status);
      }
    });
  }

  getBrowseSettings() {
    return this.browseSettings;
  }

  setBrowseSettings(key, value) {
    return this.settings.updateBrowseSettings(this.id, key, value.toString());
  }

}
