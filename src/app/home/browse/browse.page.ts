import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Storage } from '@ionic/storage';

import { LoadingService } from '../../global/services/loading.service';
import { ToastService } from '../../global/services/toast.service';
import { UserService } from '../../membership/authentication/user.service';
import { ServerService } from './server.service';

import { SettingsBrowse } from '../../settings/interfaces/settings-browse';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.page.html',
  styleUrls: ['./browse.page.scss'],
})
export class BrowsePage implements OnInit {

  private userBrowseSettings: SettingsBrowse;
  private featuredResults: any;
  private loaded: boolean;
  private slideOptions: any;

  private readonly featuredResultsKey = 'FEATURED_RESULTS';

  constructor(
    private router: Router,
    private storage: Storage,
    private user: UserService,
    private loading: LoadingService,
    private toast: ToastService,
    private server: ServerService
  ) {
    this.loaded = false;
    this.slideOptions = {
      spaceBetween: 0,
      slidesPerView: 2,
      centeredSlideBounds: true
    };
  }

  ngOnInit() {
    if (!this.userBrowseSettings) {
      this.loading.getLoading('Getting personalized settings for ' + this.user.getUsername()).then(() => {
        this.user.areSettingsStored().subscribe(async settingsStored => {
          if (settingsStored) {
            this.userBrowseSettings = this.user.getBrowserSettings();
            this.loading.dismiss().then(() => {
              this.populateFeatured();
            });
          }
        });
      });
    } else {
      this.populateFeatured().then();
    }
  }

  async populateFeatured() {
    this.server.getFeatured(this.userBrowseSettings).subscribe({
      next: async res => {
        let results;
        this.storage.ready().then(async () => {
          while (!results) { results = await this.storage.get(this.featuredResultsKey); }
          this.featuredResults = results;
          this.loaded = true;
        });
      },
      error: err => {
        console.log(err.status);
        this.toast.showError(err.status);
      }
    });
  }

}
