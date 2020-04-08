import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Storage } from '@ionic/storage';

import { SettingsBrowse } from './interfaces/settings-browse';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private readonly serverProtocol: string;
  private readonly serverPort: string;
  private readonly serverHostName: string;
  private readonly serverAddress: string;

  private readonly browseSettingsKey: string;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.serverProtocol = 'http://';
    this.serverHostName = window.location.hostname;
    this.serverPort = ':3000/settings';

    this.serverAddress =
      this.serverProtocol +
      this.serverHostName +
      this.serverPort;

    this.browseSettingsKey = 'BROWSE_SETTINGS';
  }

  getBrowseSettings(userId: number): Observable<SettingsBrowse> {
    return this.http.post<SettingsBrowse>(this.serverAddress + '/browse', { userId }).pipe(
      tap(async (res: SettingsBrowse) => {
        if (res) {
          this.storage.ready().then(async () => {
            await this.storage.set(this.browseSettingsKey, res);
          });
        }
      })
    );
  }

  getOptions(): Observable<any> {
    return this.http.post<any>(this.serverAddress + '/available', {});
  }

  updateBrowseSettings(userId: number, key: string, value: string): Observable<SettingsBrowse> {
    return this.http.post<SettingsBrowse>(this.serverAddress + '/update', { userId, key, value }).pipe(
      tap(async (res: SettingsBrowse) => {
        if (res) {
          this.storage.ready().then(async () => {
            await this.storage.set(this.browseSettingsKey, res);
          });
        }
      })
    );
  }

}
