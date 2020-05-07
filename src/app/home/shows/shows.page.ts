import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router} from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { LoadingService } from '../../global/services/loading.service';
import { ToastService } from '../../global/services/toast.service';

import { UserService } from '../../membership/authentication/user.service';
import { ResultsService } from '../results.service';
import { PortalService } from '../portal/portal.service';

import { Option } from '../../settings/interfaces/option';
import { SettingsBrowse } from '../../settings/interfaces/settings-browse';

@Component({
  selector: 'app-shows',
  templateUrl: './shows.page.html',
  styleUrls: ['./shows.page.scss'],
})
export class ShowsPage implements OnInit, OnDestroy {

  private type = 'shows';
  private settingsSub: any;
  private featuredSub: any;
  private channelsSub: any;
  private userBrowseSettings: SettingsBrowse;
  private channels: Option[];
  private sources: string[];
  private results: any[];
  private sectionHeadings: string[];
  private resultsNeeded: number;
  private backdrop: boolean;
  private slideOptions: any;

  private readonly resultLimit = 10;
  private readonly featuredResultsKey = 'FEATURED_SHOWS';
  private readonly newResultsKey = 'NEW_SHOWS';
  private readonly channelResultsBaseKey = 'SHOWS_';
  private readonly recentlyViewedKey = 'RECENTLY_VIEWED';

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private storage: Storage,
    private loading: LoadingService,
    private toast: ToastService,
    private user: UserService,
    private resultsService: ResultsService,
    private portal: PortalService
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
    this.settingsSub = this.user.areSettingsStored().subscribe(stored => {
      if (stored) {
        this.userBrowseSettings = this.user.getBrowseSettings();
        this.fetchListings(true).then();
      }
    });
    this.featuredSub = this.resultsService.areFeaturedShowsStored().subscribe(stored => {
      if (stored) {
        this.fetchStoredListing(this.featuredResultsKey).then(result => {
          this.addSection(result, 'Featured');
        });
        this.fetchStoredListing(this.newResultsKey).then(result => {
          this.addSection(result, 'New Releases');
        });
      }
    });
    this.channelsSub = this.resultsService.areChannelShowsStored().subscribe(stored => {
      if (stored) {
        this.channels.forEach(channel => {
          this.fetchStoredListing(this.channelResultsBaseKey + channel.value).then(result => {
            this.addSection(result, channel.title);
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.settingsSub.unsubscribe();
    this.featuredSub.unsubscribe();
    this.channelsSub.unsubscribe();
  }

  slidesLoaded() {
    this.resultsNeeded -= 1;
    if (this.resultsNeeded === 0) {
      this.loading.dismiss().then(() => {
        this.backdrop = false;
      });
    }
  }

  addSection(listing, title) {
    this.results.push(listing);
    this.sectionHeadings.push(title);
    this.resultsNeeded += 1;
  }

  async fetchStoredListing(storageKey) {
    await this.storage.ready();
    return await this.storage.get(storageKey);
  }

  async fetchListings(checkStorage: boolean) {
    this.loading.getLoading('Updating Shows...').then();
    this.backdrop = true;
    this.results = [];
    this.channels = [];
    this.sources = [];
    this.sectionHeadings = [];
    this.resultsNeeded = 0;
    await this.userBrowseSettings.options.forEach(option => {
      switch (option.type) {
        case 'channel':
          this.channels.push(option);
          break;
        case 'source':
          this.sources.push(option.value);
      }
    });
    await this.resultsService.featured(this.type, false, this.sources, this.resultLimit, [], this.featuredResultsKey, checkStorage, 2);
    await this.resultsService.featured(this.type, true, this.sources, this.resultLimit, [], this.newResultsKey, checkStorage, 2);
    for (const channel of this.channels) {
      // tslint:disable-next-line:max-line-length
      await this.resultsService.byChannel(this.type, channel.value, this.resultLimit, [], this.channelResultsBaseKey + channel.value, checkStorage, this.channels.length);
    }
  }

  logView(show) {
    this.portal.addView(this.user.getId(), this.type, show.id, show.title, show.artwork_304x171, this.recentlyViewedKey).then(() => {
      this.navCtrl.navigateForward('/view').then();
    });
  }

  fetchNextResults(index) {
  }

  refreshPage(event) {
    this.fetchListings(false).then(() => {
      event.target.complete();
    });
  }
}
