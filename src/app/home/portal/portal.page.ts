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
  private sectionHeadings = [];
  private resultsNeeded: number;
  private backdrop: boolean;
  private slideOptions: any;

  private viewsSub: any;
  private watchedSub: any;
  private savedSub: any;

  private readonly defaultSections = ['Keep Watching', 'Recent History', 'Saved For Later', 'Favorites', 'Watch Again'];
  private readonly resultLimit = 10;
  private readonly viewsHistoryKey = 'VIEWS_HISTORY';
  private readonly watchHistoryKey = 'WATCH_HISTORY';
  private readonly savedHistoryKey = 'SAVED_HISTORY';

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
    this.viewsSub = this.portal.areViewsStored().subscribe(async stored => {
      if (stored) {
        this.fetchStoredListing(this.viewsHistoryKey).then(listing => {
          if (listing) {
            this.addSection(listing, 'Recently Viewed');
          }
        });
      }
    });
    this.watchedSub = this.portal.isWatchedStored().subscribe(async stored => {
      if (stored) {
        this.fetchStoredListing(this.watchHistoryKey).then(listing => {
          if (listing) {
            this.addSection(listing, 'Watch Again');
          }
        });
      }
    });
    this.savedSub = this.portal.isSavedStored().subscribe(async stored => {
      if (stored) {
        this.fetchStoredListing(this.savedHistoryKey).then(listing => {
          if (listing) {
            this.addSection(listing, 'Saved For Later');
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.viewsSub.unsubscribe();
    this.watchedSub.unsubscribe();
    this.savedSub.unsubscribe();
  }

  ionViewWillEnter() {
    this.loading.getLoading('Connecting to ' + this.user.getUsername() + '\'s Portal...').then();
    this.fetchListings(true).then();
  }

  async fetchListings(checkStorage: boolean) {
    this.backdrop = true;
    this.results = [];
    this.sectionHeadings = [];
    this.resultsNeeded = 0;
    this.portal.views(this.user.getId(), this.viewsHistoryKey, checkStorage).then();
    this.portal.watched(this.user.getId(), this.watchHistoryKey, checkStorage).then();
    this.portal.saved(this.user.getId(), this.savedHistoryKey, checkStorage).then();
  }

  async fetchStoredListing(storageKey) {
    await this.storage.ready();
    return await this.storage.get(storageKey);
  }

  addSection(listing, title) {
    this.results.push(listing);
    this.sectionHeadings.push(title);
    this.resultsNeeded += 1;
  }

  slidesLoaded() {
    this.resultsNeeded -= 1;
    if (this.resultsNeeded === 0) {
      this.loading.dismiss().then(() => {
        this.backdrop = false;
      });
    }
  }

  fetchNextResults(index) {
  }

  refreshPage(event) {
    this.fetchListings(false).then(() => {
      event.target.complete();
    });
  }

}
