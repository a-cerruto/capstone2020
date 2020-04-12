import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { LoadingService } from '../../global/services/loading.service';
import { ToastService } from '../../global/services/toast.service';

import { UserService } from '../../membership/authentication/user.service';
import { PortalService } from './portal.service';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.page.html',
  styleUrls: ['./portal.page.scss'],
})
export class PortalPage implements OnInit, OnDestroy {

  private results: any[];
  private sectionHeadings: string[];
  private resultsNeeded: number;
  private backdrop: boolean;
  private slideOptions: any;

  private readonly defaultSections = ['Keep Watching', 'Recent History', 'Saved For Later', 'Favorites', 'Watch Again'];
  private readonly resultLimit = 10;
  private readonly keepWatchingKey = 'KEEP_WATCHING';
  private readonly recentHistoryKey = 'RECENT_HISTORY';
  private readonly savedForLaterKey = 'SAVED_FOR_LATER';
  private readonly savedFavoritesKey = 'SAVED_FAVORITES';
  private readonly watchAgainKey = 'WATCH_AGAIN';

  constructor(
    private router: Router,
    private storage: Storage,
    private loading: LoadingService,
    private toast: ToastService,
    private user: UserService,
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
    this.loading.getLoading('Connecting to ' + this.user.getUsername() + '\'s Portal...').then();
    this.fetchListings(false).then();
  }

  ngOnDestroy() {
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
    this.sectionHeadings = [...this.defaultSections];
    this.resultsNeeded = 5;
    await this.results.push(await this.portal.watched(this.user.getId(), true, this.keepWatchingKey, checkStorage));
    await this.results.push(await this.portal.views(this.user.getId(), this.recentHistoryKey, checkStorage));
    await this.results.push(await this.portal.saved(this.user.getId(), 'for_later', this.savedForLaterKey, checkStorage));
    await this.results.push(await this.portal.saved(this.user.getId(), 'favorites', this.savedFavoritesKey, checkStorage));
    await this.results.push(await this.portal.watched(this.user.getId(), false, this.watchAgainKey, checkStorage));
  }

  fetchNextResults(index) {
  }

}
