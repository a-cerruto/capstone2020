import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

import { ToastService } from '../../global/services/toast.service';

import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor(
    private storage: Storage,
    private toast: ToastService,
    private server: ServerService
  ) { }


  async featured(type, newOnly, sources, limit, prevResults, storageKey, checkStorage) {
    if (checkStorage) {
      await this.storage.ready();
      const results = await this.storage.get(storageKey);
      return results ? results : await this.featured(type, newOnly, sources, limit, prevResults, storageKey, false);
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

  async byChannel(type, channel, limit, prevShows, storageKey, checkStorage) {
    if (checkStorage) {
      await this.storage.ready();
      const results = await this.storage.get(storageKey);
      return results ? results : this.byChannel(type, channel, limit, prevShows, storageKey, false);
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


}
