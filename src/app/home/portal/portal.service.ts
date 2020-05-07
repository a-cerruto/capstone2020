import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PortalService {

  private readonly serverProtocol: string;
  private readonly serverPort: string;
  private readonly serverHostName: string;
  private readonly serverAddress: string;

  private viewsStored = new BehaviorSubject(false);
  private recentlyViewedStored = new BehaviorSubject(false);
  private watchedStored = new BehaviorSubject(false);
  private savedStored = new BehaviorSubject(false);

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
      results ? this.viewsStored.next(true) : await this.views(userId, storageKey, !checkStorage);
    } else {
      await this.fetchViews(userId, storageKey).subscribe({
        next: res => res,
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
          this.viewsStored.next(true);
        }
      })
    );
  }

  async addView(userId, type, id, title, image, provider, storageKey) {
    await this.storage.ready();
    await this.storage.set(storageKey, [type, id, title, image, provider]);
    this.recentlyViewedStored.next(true);
    await this.postView(userId, type, id, title, image, provider).subscribe({
      next: res => res,
      error: err => console.log(err)
    });
  }

  postView(userId, type, id, title, image, provider) {
    return this.http.post(this.serverAddress + '/views/add', { userId, type, id, title, image, provider }).pipe(
      tap(res => {
        console.log(res);
      })
    );
  }

  async watched(userId, storageKey, checkStorage) {
    if (checkStorage) {
      const results = await this.getStorage(storageKey);
      results ? this.watchedStored.next(true) : await this.watched(userId, storageKey, !checkStorage);
    } else {
      await this.fetchWatched(userId, storageKey).subscribe({
        next: res => res,
        error: err => console.log(err)
      });
    }
  }

  fetchWatched(userId, storageKey): Observable<any> {
    return this.http.post(this.serverAddress + '/watched', { userId }).pipe(
      tap(async (res: any) => {
        console.log(res);
        if (res) {
          await this.setStorage(storageKey, res);
          this.watchedStored.next(true);
        }
      })
    );
  }

  async addWatched(userId, type, id, title, image, provider) {
    await this.postWatched(userId, type, id, title, image, provider).subscribe({
      next: res => res,
      error: err => console.log(err)
    });
  }

  postWatched(userId, type, id, title, image, provider) {
    return this.http.post(this.serverAddress + '/watched/add', { userId, type, id, title, image, provider }).pipe(
      tap(res => {
        console.log(res);
      })
    );
  }

  async saved(userId, storageKey, checkStorage) {
    if (checkStorage) {
      const results = await this.getStorage(storageKey);
      results ? this.savedStored.next(true) : await this.saved(userId, storageKey, checkStorage);
    } else {
      await this.fetchSaved(userId, storageKey).subscribe({
        next: res => res,
        error: err => console.log(err)
      });
    }
  }

  fetchSaved(userId, storageKey): Observable<any> {
    return this.http.post(this.serverAddress + '/saved', { userId }).pipe(
      tap(async (res: any) => {
        console.log(res);
        if (res) {
          await this.setStorage(storageKey, res);
          this.savedStored.next(true);
        }
      })
    );
  }

  async addSaved(userId, type, id, title, image) {
    await this.postSaved(userId, type, id, title, image).subscribe({
      next: res => res,
      error: err => console.log(err)
    });
  }

  postSaved(userId, type, id, title, image) {
    return this.http.post(this.serverAddress + '/saved/add', { userId, type, id, title, image }).pipe(
      tap(res => {
        console.log(res);
      })
    );
  }

  areViewsStored() {
    return this.viewsStored.asObservable();
  }

  isRecentlyViewedStored() {
    return this.recentlyViewedStored.asObservable();
  }

  isWatchedStored() {
    return this.watchedStored.asObservable();
  }

  isSavedStored() {
    return this.savedStored.asObservable();
  }
}
