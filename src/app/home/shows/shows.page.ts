import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router} from '@angular/router';
import { Storage } from '@ionic/storage';

import { LoadingService } from '../../global/services/loading.service';
import { ToastService } from '../../global/services/toast.service';

import { UserService } from '../../membership/authentication/user.service';
import { ResultsService } from '../services/results.service';
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
  private readonly featuredResultsKey = 'FEATURED_SHOWS';
  private readonly newResultsKey = 'NEW_SHOWS';
  private readonly channelResultsBaseKey = 'SHOWS_';

  constructor(
    private router: Router,
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
    this.backdrop = true;
    this.loading.getLoading('Updating Shows...').then();
    this.settingsSubscription = this.user.areSettingsStored().subscribe(stored => {
      if (stored) {
        this.userBrowseSettings = this.user.getBrowseSettings();
        this.fetchListings(true).then();
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

  async fetchListings(checkStorage: boolean) {
    this.results = [];
    this.channels = [];
    this.sources = [];
    this.sectionHeadings = [...this.defaultSections];
    this.resultsNeeded = 2;
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
    await this.results.push(
      await this.resultsService.featured(this.type, true, this.sources, this.resultLimit, [], this.newResultsKey, checkStorage)
    );
    for (const channel of this.channels) {
      // tslint:disable-next-line:max-line-length
      await this.results.push(await this.resultsService.byChannel(this.type, channel.value, this.resultLimit, [], this.channelResultsBaseKey + channel.value, checkStorage)
      );
    }
  }

  fetchNextResults(index) {
  }

  logView(show) {
    this.portal.addView(this.user.getId(), this.type, show.id, show.title, show.artwork_304x171).then();
  }
}
