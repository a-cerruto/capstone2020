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
          this.viewsStored.next(true);
        }
      })
    );
  }

  async addView(userId, type, id, title, image) {
    await this.postView(userId, type, id, title, image).subscribe({
      next: async res => res,
      error: err => console.log(err)
    });
  }

  postView(userId, type, id, title, image) {
    return this.http.post(this.serverAddress + '/views/add', { userId, type, id, title, image }).pipe(
      tap(res => {
        console.log(res);
      })
    );
  }

  async watched(userId, storageKey, checkStorage) {
    if (checkStorage) {
      const results = await this.getStorage(storageKey);
      return results ? results : await this.watched(userId, storageKey, checkStorage);
    } else {
      await this.fetchWatched(userId, storageKey).subscribe({
        next: async res => res,
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

  async saved(userId, storageKey, checkStorage) {
    if (checkStorage) {
      const results = await this.getStorage(storageKey);
      return results ? results : await this.saved(userId, storageKey, checkStorage);
    } else {
      await this.fetchSaved(userId, storageKey).subscribe({
        next: async res => res,
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

  areViewsStored() {
    return this.viewsStored.asObservable();
  }

  isWatchedStored() {
    return this.watchedStored.asObservable();
  }

  isSavedStored() {
    return this.savedStored.asObservable();
  }
}
