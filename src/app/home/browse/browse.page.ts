import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router} from '@angular/router';
import { Storage } from '@ionic/storage';

import { LoadingService } from '../../global/services/loading.service';
import { ToastService } from '../../global/services/toast.service';

import { UserService } from '../../membership/authentication/user.service';
import { ServerService } from './server.service';

import { Option } from '../../settings/interfaces/option';
import { SettingsBrowse } from '../../settings/interfaces/settings-browse';


@Component({
  selector: 'app-browse',
  templateUrl: './browse.page.html',
  styleUrls: ['./browse.page.scss'],
})
export class BrowsePage implements OnInit, OnDestroy {

  private settingsSubscription: any;
  private userBrowseSettings: SettingsBrowse;
  private channels: Option[];
  private sources: string[];
  private featuredResults: any;
  private newResults: any;
  private channelResults: any;
  private sectionHeadings: string[];
  private resultsLoaded: number;
  private resultsNeeded: number;
  private backdrop: boolean;
  private slideOptions: any;

  private readonly resultLimit = 25;
  private readonly featuredResultsKey = 'FEATURED_RESULTS';
  private readonly newResultsKey = 'NEW_RESULTS';
  private readonly channelResultKeyBase = 'CHANNEL_RESULTS_';

  constructor(
    private router: Router,
    private storage: Storage,
    private loading: LoadingService,
    private toast: ToastService,
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
        1100: {
          slidesPerView: 5
        },
        1200: {
          slidesPerView: 6
        },
        1300: {
          slidesPerView: 7
        },
        1440: {
          slidesPerView: 8
        }
      }
    };
  }

  ngOnInit() {
    this.fetchData(true).then();
  }

  ngOnDestroy() {
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
  }

  async fetchData(checkStorage) {
    this.backdrop = true;
    this.loading.getLoading('Getting new titles...').then(() => {
      if (this.userBrowseSettings) { this.getAllListings(checkStorage).then(); }
      this.settingsSubscription = this.user.areSettingsStored().subscribe(stored => {
        if (stored) {
          this.userBrowseSettings = this.user.getBrowseSettings();
          this.getAllListings(true).then();
        }
      });
    });
  }

  slidesLoaded() {
    this.resultsLoaded += 1;
    if (this.resultsLoaded === this.resultsNeeded) {
      this.loading.dismiss().then(() => {
        this.backdrop = false;
      });
    }
  }

  async getAllListings(checkStorage: boolean) {
    this.channels = [];
    this.sources = [];
    this.resultsLoaded = 0;
    this.resultsNeeded = 2;
    this.sectionHeadings = [];
    let result;
    this.userBrowseSettings.options.forEach(option => {
      switch (option.type) {
        case 'channel':
          this.channels.push(option);
          this.sectionHeadings.push(option.title);
          break;
        case 'source':
          this.sources.push(option.value);
      }
    });

    this.featuredResults = await this.getFeaturedList(false, this.resultLimit, [], this.featuredResultsKey, checkStorage);

    result = await this.getFeaturedList(true, this.resultLimit, [], this.newResultsKey, checkStorage);
    this.newResults = result;

    const results = [];
    for (const channel of this.channels) {
      result = await this.getShowsByChannel(channel.value, this.resultLimit, [], this.channelResultKeyBase + channel.value, checkStorage);
      results.push(result);
      this.resultsNeeded += 1;
      if (results.length === this.channels.length) {
        this.channelResults = results;
      }
    }
  }

  async getFeaturedList(newShowsOnly, limit, prevShows, storageKey, checkStorage) {
    if (checkStorage) {
      await this.storage.ready();
      const results = await this.storage.get(storageKey);
      return results ? results : await this.getFeaturedList(newShowsOnly, limit, prevShows, storageKey, false);
    } else {
      await this.server.getFeaturedShows(newShowsOnly, this.sources, limit, prevShows, storageKey).subscribe({
        next: res => res,
        error: err => {
          console.log(err);
          this.toast.showError(err.status);
        }
      });
    }
  }

  async getShowsByChannel(channel, limit, prevShows, storageKey, checkStorage) {
    if (checkStorage) {
      await this.storage.ready();
      const results = await this.storage.get(storageKey);
      return results ? results : this.getShowsByChannel(channel, limit, prevShows, storageKey, false);
    } else {
      this.server.getShowsByChannel(channel, limit, prevShows, storageKey).subscribe({
        next: res => res,
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

  async refreshData(ev) {
    await this.fetchData(false);
    ev.target.complete();
  }
}
