import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router} from '@angular/router';
import { Storage } from '@ionic/storage';

import { LoadingService } from '../../global/services/loading.service';
import { ToastService } from '../../global/services/toast.service';

import { UserService } from '../../membership/authentication/user.service';
import { ResultsService } from '../services/results.service';

import { Option } from '../../settings/interfaces/option';
import { SettingsBrowse } from '../../settings/interfaces/settings-browse';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit, OnDestroy {

  private type = 'movies';
  private settingsSubscription: any;
  private userBrowseSettings: SettingsBrowse;
  private channels: Option[];
  private sources: string[];
  private results: any[];
  private sectionHeadings: string[];
  private resultsNeeded: number;
  private backdrop: boolean;
  private slideOptions: any;

  private readonly defaultSections = ['Featured', 'New Releases'];
  private readonly resultLimit = 10;
  private readonly featuredResultsKey = 'FEATURED_MOVIES';
  private readonly newResultsKey = 'NEW_MOVIES';
  private readonly channelResultsBaseKey = 'MOVIES_';

  constructor(
    private router: Router,
    private storage: Storage,
    private loading: LoadingService,
    private toast: ToastService,
    private user: UserService,
    private resultsService: ResultsService
  ) {
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
    this.backdrop = true;
    this.loading.getLoading('Updating Movies...').then();
    if (this.userBrowseSettings) { this.getAllListings(true).then(); }
    this.settingsSubscription = this.user.areSettingsStored().subscribe(stored => {
      if (stored) {
        this.userBrowseSettings = this.user.getBrowseSettings();
        this.getAllListings(true).then();
      }
    });
  }

  ngOnDestroy() {
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
  }

  slidesLoaded() {
    this.resultsNeeded -= 1;
    if (this.resultsNeeded === 0) {
      this.loading.dismiss().then(() => {
        this.backdrop = false;
      });
    }
  }

  async getAllListings(checkStorage: boolean) {
    this.results = [];
    this.channels = [];
    this.sources = [];
    this.resultsNeeded = 2;
    this.sectionHeadings = [...this.defaultSections];
    await this.userBrowseSettings.options.forEach(option => {
      switch (option.type) {
        case 'channel':
          this.resultsNeeded += 1;
          this.channels.push(option);
          this.sectionHeadings.push(option.title);
          break;
        case 'source':
          this.sources.push(option.value);
      }
    });
    await this.results.push(
      await this.resultsService.featured(this.type, false, this.sources, this.resultLimit, [], this.featuredResultsKey, checkStorage)
    );
    this.results.push(
      await this.resultsService.featured(this.type, true, this.sources, this.resultLimit, [], this.newResultsKey, checkStorage)
    );
    for (const channel of this.channels) {
      this.results.push(
        // tslint:disable-next-line:max-line-length
        await this.resultsService.byChannel(this.type, channel.value, this.resultLimit, [], this.channelResultsBaseKey + channel.value, checkStorage)
      );
    }
  }
}
