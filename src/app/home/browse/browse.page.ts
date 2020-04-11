import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { LoadingService } from '../../global/services/loading.service';
import { ToastService } from '../../global/services/toast.service';

import { UserService } from '../../membership/authentication/user.service';
import { ServerService } from '../services/server.service';

import { Option } from '../../settings/interfaces/option';
import { SettingsBrowse } from '../../settings/interfaces/settings-browse';


@Component({
  selector: 'app-browse',
  templateUrl: './browse.page.html',
  styleUrls: ['./browse.page.scss'],
})
export class BrowsePage implements OnInit, OnDestroy {

  private readonly type: string;
  private title: string;
  private settingsSubscription: any;
  private userBrowseSettings: SettingsBrowse;
  private channels: Option[];
  private sources: string[];
  private results: any[];
  private sectionHeadings: string[];
  private resultsLoaded: number;
  private resultsNeeded: number;
  private backdrop: boolean;
  private slideOptions: any;

  private readonly defaultSections = ['Featured', 'New Releases'];
  private readonly resultLimit = 10;
  private readonly featuredResultsKey = 'FEATURED_';
  private readonly newResultsKey = 'NEW_';
  private readonly channelResultsBaseKey = 'CHANNEL_';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    private loading: LoadingService,
    private toast: ToastService,
    private user: UserService,
    private server: ServerService
  ) {
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    this.featuredResultsKey += this.type.toUpperCase();
    this.newResultsKey += this.type.toUpperCase();
    this.channelResultsBaseKey += this.type.toUpperCase() + '_';
    this.title = this.type.charAt(0).toUpperCase() + this.type.substring(1);
    this.slideOptions = {
      spaceBetween: 0,
      slidesPerView: 10,
      breakpoints: {
        330: {
          slidesPerView: 1
        },
        470: {
          slidesPerView: 2
        },
        650: {
          slidesPerView: 3
        },
        850: {
          slidesPerView: 4
        },
        1100: {
          slidesPerView: 5
        },
        1300: {
          slidesPerView: 6
        },
        1500: {
          slidesPerView: 7
        },
        1700: {
          slidesPerView: 8
        },
        1900: {
          slidesPerView: 9
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
    this.results = [];
    this.channels = [];
    this.sources = [];
    this.resultsLoaded = 0;
    this.resultsNeeded = 2;
    this.sectionHeadings = [...this.defaultSections];
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
    this.results.push(
      await this.getFeaturedResults(
        this.type,
        false,
        this.sources,
        this.resultLimit,
        [],
        this.featuredResultsKey,
        checkStorage)
    );
    this.results.push(
      await this.getFeaturedResults(
        this.type,
        true,
        this.sources,
        this.resultLimit,
        [],
        this.newResultsKey,
        checkStorage)
    );
    for (const channel of this.channels) {
      this.results.push(
        await this.getResultsByChannel(
          this.type,
          channel.value,
          this.resultLimit,
          [],
          this.channelResultsBaseKey + channel.value,
          checkStorage)
      );
      this.resultsNeeded += 1;
    }
  }

  async getFeaturedResults(type, newOnly, sources, limit, prevResults, storageKey, checkStorage) {
    if (checkStorage) {
      await this.storage.ready();
      const results = await this.storage.get(storageKey);
      return results ? results : await this.getFeaturedResults(type, newOnly, sources, limit, prevResults, storageKey, false);
    } else {
      await this.server.getFeaturedResults(type, newOnly, sources, limit, prevResults, storageKey).subscribe({
        next: res => res,
        error: err => {
          console.log(err);
          this.toast.showError(err.status);
        }
      });
    }
  }

  async getResultsByChannel(type, channel, limit, prevShows, storageKey, checkStorage) {
    if (checkStorage) {
      await this.storage.ready();
      const results = await this.storage.get(storageKey);
      return results ? results : this.getResultsByChannel(type, channel, limit, prevShows, storageKey, false);
    } else {
      this.server.getResultsByChannel(type, channel, limit, prevShows, storageKey).subscribe({
        next: res => res,
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
