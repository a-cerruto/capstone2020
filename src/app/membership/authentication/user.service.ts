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
  }

  login(form) {
    return this.authentication.login(form.value);
  }

  async logout() {
    await this.loading.getLoading('Logging out...');
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
      console.log('user: ' + JSON.stringify(user));
      console.log('id: ' + this.id);
      console.log('email: ' + this.email);
      console.log('username: ' + this.username);
      this.initSettings();
    });
  }

  initSettings() {
    this.settings.getBrowseSettings(this.id).subscribe({
      next: (res: SettingsBrowse) => {
        this.storeSettings(res);
      },
      error: err => {
        this.handleError(err);
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

  areSettingsStored() {
    return this.settingsStored.asObservable();
  }

  getBrowseSettings() {
    return this.browseSettings;
  }

  storeSettings(settings) {
    console.log(settings);
    this.browseSettings = settings;
    this.settingsStored.next(true);
  }

  setBrowseSettings(key, value) {
    return this.settings.updateBrowseSettings(this.id, key, value.toString()).subscribe({
      next: (res: SettingsBrowse) => {
        this.storeSettings(res);
      },
      error: err => {
        this.handleError(err);
      }
    });
  }

  setOptionsSettings(type, options) {
    return this.settings.updateOptionsSettings(this.id, type, options).subscribe( {
      next: (res: SettingsBrowse) => {
        this.storeSettings(res);
      },
      error: err => {
        this.handleError(err);
      }
    });
  }

  handleError(error) {
    console.log(error.status);
    this.toast.showError(error.status);
  }

}
