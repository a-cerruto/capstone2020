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
  private actionResults: any;
  private comedyResults: any;
  private horrorResults: any;
  private movieResults: any;
  private resultsLoaded: boolean;
  private backdrop: boolean;
  private slideOptions: any;

  private readonly featuredResultsKey = 'FEATURED_RESULTS';
  private readonly actionResultsKey = 'ACTION_RESULTS';
  private readonly comedyResultsKey = 'COMEDY_RESULTS';
  private readonly horrorResultsKey = 'HORROR_RESULTS';
  private readonly movieResultsKey = 'MOVIE_RESULTS';

  constructor(
    private router: Router,
    private storage: Storage,
    private user: UserService,
    private loading: LoadingService,
    private toast: ToastService,
    private server: ServerService
  ) {
    this.resultsLoaded = false;
    this.backdrop = true;
    this.slideOptions = {
      spaceBetween: 0,
      slidesPerView: 2
    };
  }

  ngOnInit() {
    if (!this.userBrowseSettings) {
      this.loading.getLoading('Getting new titles...').then(() => {
        this.user.areSettingsStored().subscribe(async settingsStored => {
          if (settingsStored) {
            this.userBrowseSettings = this.user.getBrowserSettings();
            this.getListings();
          }
        });
      });
    } else {
      this.getListings().then();
    }
  }

  async getListings() {
    await this.getShowsList(this.featuredResultsKey, '', (results) => {
      this.featuredResults = results;
    });
    await this.getShowsList(this.actionResultsKey, 'action', (results) => {
      this.actionResults = results;
    });
    await this.getShowsList(this.comedyResultsKey, 'comedy', (results) => {
      this.comedyResults = results;
    });
    await this.getShowsList(this.horrorResultsKey, 'horror', (results) => {
      this.horrorResults = results;
    });
    await this.getMovieList(this.movieResultsKey, (results) => {
      this.movieResults = results;
      this.resultsLoaded = true;
      this.backdrop = false;
      this.loading.dismiss();
    });
  }

  async getShowsList(key, tags, callback) {
    await this.storage.ready();
    let results = await this.storage.get(key);
    if (results) {
      callback(results);
    } else {
      this.server.getShows(this.userBrowseSettings, tags, key).subscribe({
        next: async res => {
          this.storage.ready().then(async () => {
            results = await this.storage.get(key);
            callback(results);
          });
        },
        error: err => {
          console.log(err.status);
          this.toast.showError(err.status);
        }
      });
    }
  }

  async getMovieList(key, callback) {
    await this.storage.ready();
    let results = await this.storage.get(key);
    if (results) {
      callback(results);
    } else {
      this.server.getMovies(this.userBrowseSettings, key).subscribe({
        next: async res => {
          this.storage.ready().then(async () => {
            results = await this.storage.get(key);
            callback(results);
          });
        },
        error: err => {
          console.log(err.status);
          this.toast.showError(err.status);
        }
      });
    }
  }
}
