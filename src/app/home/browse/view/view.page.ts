import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { LoadingService } from '../../../global/services/loading.service';
import { ToastService } from '../../../global/services/toast.service';

import { UserService } from '../../../membership/authentication/user.service';
import { PortalService } from '../../portal/portal.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit, OnDestroy {

  private recentlyViewedSub: any;
  private result: any;

  private readonly recentlyViewedKey = 'RECENTLY_VIEWED';

  constructor(
    private router: Router,
    private storage: Storage,
    private loading: LoadingService,
    private toast: ToastService,
    private user: UserService,
    private portal: PortalService
  ) { }

  ngOnInit() {
    this.recentlyViewedSub = this.portal.isRecentlyViewedStored().subscribe(stored => {
      if (stored) {
        this.storage.ready().then(async () => {
          this.result = await this.storage.get(this.recentlyViewedKey);
          console.log(this.result);
        });
      }
    });
  }

  ngOnDestroy() {
    this.recentlyViewedSub.unsubscribe();
  }

  addWatched(result) {
    this.portal.addWatched(this.user.getId(), result[0], result[1], result[2], result[3], result[4]).then(() => {
      this.toast.showSuccess('Successfully Added!');
    });
  }

  addSaved(result) {
    this.portal.addSaved(this.user.getId(), result[0], result[1], result[2], result[3]).then(() => {
      this.toast.showSuccess('Added to Watched List!');
    });
  }
}
