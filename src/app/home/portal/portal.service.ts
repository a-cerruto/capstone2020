import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PortalService {

  private readonly serverProtocol: string;
  private readonly serverPort: string;
  private readonly serverHostName: string;
  private readonly serverAddress: string;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.serverProtocol = 'http://';
    this.serverHostName = window.location.hostname;
    this.serverPort = ':3000/portal';

    this.serverAddress =
      this.serverProtocol +
      this.serverHostName +
      this.serverPort;
  }

  async getStorage(key) {
    await this.storage.ready();
    return await this.storage.get(key);
  }

  async setStorage(key, value) {
    await this.storage.ready();
    await this.storage.set(key, value);
  }

  async views(userId, storageKey, checkStorage) {
    if (checkStorage) {
      const results = await this.getStorage(storageKey);
      return results ? results : await this.views(userId, storageKey, checkStorage);
    } else {
      await this.fetchViews(userId, storageKey).subscribe({
        next: async res => res,
        error: err => console.log(err)
      });
    }
  }

  fetchViews(userId, storageKey): Observable<any> {
    return this.http.post(this.serverAddress + '/views', { userId }).pipe(
      tap(async (res: any) => {
        console.log(res);
        if (res) {
          await this.setStorage(storageKey, res);
        }
      })
    );
  }

  async watched(userId, resume, storageKey, checkStorage) {
    if (checkStorage) {
      const results = await this.getStorage(storageKey);
      return results ? results : await this.watched(userId, resume, storageKey, checkStorage);
    } else {
      await this.fetchWatched(userId, resume, storageKey).subscribe({
        next: async res => res,
        error: err => console.log(err)
      });
    }
  }

  fetchWatched(userId, resume, storageKey): Observable<any> {
    return this.http.post(this.serverAddress + '/watched', { userId, resume }).pipe(
      tap(async (res: any) => {
        console.log(res);
        if (res) {
          await this.setStorage(storageKey, res);
        }
      })
    );
  }

  async saved(userId, type, storageKey, checkStorage) {
    if (checkStorage) {
      const results = await this.getStorage(storageKey);
      return results ? results : await this.saved(userId, type, storageKey, checkStorage);
    } else {
      await this.fetchSaved(userId, type, storageKey).subscribe({
        next: async res => res,
        error: err => console.log(err)
      });
    }
  }

  fetchSaved(userId, type, storageKey): Observable<any> {
    return this.http.post(this.serverAddress + '/saved', { userId, type }).pipe(
      tap(async (res: any) => {
        console.log(res);
        if (res) {
          await this.setStorage(storageKey, res);
        }
      })
    );
  }
}
