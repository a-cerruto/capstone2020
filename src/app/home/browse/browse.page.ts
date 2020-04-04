import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { LoadingService } from '../../global/services/loading.service';
import { ToastService } from '../../global/services/toast.service';

import { SettingsService } from '../../settings/settings.service';
import { UserService } from '../../membership/authentication/user.service';
import { ServerService } from './server.service';

import {SettingsBrowse} from '../../settings/interfaces/settings-browse';


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
  private resultsLoaded: number;
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
    private loading: LoadingService,
    private toast: ToastService,
    private settings: SettingsService,
    private user: UserService,
    private server: ServerService
  ) {
    this.slideOptions = {
      spaceBetween: 0,
      slidesPerView: 10,
      breakpoints: {
        320: {
          slidesPerView: 1
        },
        450: {
          slidesPerView: 2
        },
        650: {
          slidesPerView: 3
        },
        900: {
          slidesPerView: 4
        },
        1000: {
          slidesPerView: 5
        },
        1100: {
          slidesPerView: 6
        },
        1200: {
          slidesPerView: 7
        },
        1300: {
          slidesPerView: 8
        },
        1440: {
          slidesPerView: 9
        }
      }
    };
  }

  ngOnInit() {
    this.resultsLoaded = 0;
    this.backdrop = true;
    this.loading.getLoading('Getting new titles...').then(() => {
      this.settings.browseSettingsStored().subscribe(async stored => {
        if (stored) {
          this.userBrowseSettings = this.user.getBrowserSettings();
          this.getListings();
        }
      });
    });
  }

  slidesLoaded() {
    this.resultsLoaded += 1;
    if (this.resultsLoaded === 5) {
      this.loading.dismiss().then(() => {
        this.backdrop = false;
      });
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
