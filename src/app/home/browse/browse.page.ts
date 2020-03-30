import { Component, OnInit } from '@angular/core';

import { LoadingService } from '../../global/services/loading.service';
import { ToastService } from '../../global/services/toast.service';
import { UserService } from '../../membership/authentication/user.service';

import { SettingsBrowse } from '../../settings/interfaces/settings-browse';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.page.html',
  styleUrls: ['./browse.page.scss'],
})
export class BrowsePage implements OnInit {

  private userBrowseSettings: SettingsBrowse;

  constructor(
    private user: UserService,
    private loading: LoadingService,
    private toast: ToastService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (!this.userBrowseSettings) {
      this.loading.getLoading('Getting personalized settings for ' + this.user.getUsername()).then(() => {
        this.user.areSettingsStored().subscribe(async settingsStored => {
          if (settingsStored) {
            this.userBrowseSettings = this.user.getBrowserSettings();
            this.loading.dismiss().then(() => {
              console.log(this.userBrowseSettings);
            });
          }
        });
      });
    }
  }

}
