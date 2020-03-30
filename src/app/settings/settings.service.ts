import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

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

  private readonly browserSettingsKey: string;

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

    this.browserSettingsKey = 'BROWSER_SETTINGS';
  }

  getDefaultBrowserSettings(id: number): Observable<SettingsBrowse> {
    return this.http.post<SettingsBrowse>(this.serverAddress + '/browse', { user_id: id }).pipe(
      tap(async (res: SettingsBrowse) => {
        if (res) {
          this.storage.ready().then(async () => {
            await this.storage.set(this.browserSettingsKey, res);
          });
        }
      })
    );
  }
}
