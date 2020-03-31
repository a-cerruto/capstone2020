import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Storage } from '@ionic/storage';

import { SettingsBrowse } from '../../settings/interfaces/settings-browse';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly serverProtocol: string;
  private readonly serverPort: string;
  private readonly serverHostName: string;
  private readonly serverAddress: string;

  private readonly featuredResultsKey: string;
  private readonly detailsKey: string;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.serverProtocol = 'http://';
    this.serverHostName = window.location.hostname;
    this.serverPort = ':3000/browse';

    this.serverAddress =
      this.serverProtocol +
      this.serverHostName +
      this.serverPort;

    this.featuredResultsKey = 'FEATURED_RESULTS';
    this.detailsKey = 'DETAILS';
  }

  getFeatured(settings: SettingsBrowse): Observable<any> {
    return this.http.post(this.serverAddress + '/featured', settings).pipe(
      tap(async (res: any) => {
        console.log(res);
        if (res) {
          this.storage.ready().then(async () => {
            await this.storage.set(this.featuredResultsKey, res);
          });
        }
      })
    );
  }

  getShowDetails(id: number): Observable<any> {
    return this.http.post(this.serverAddress + '/show_details', { id }).pipe(
      tap(async (res: any) => {
        console.log(res);
        if (res) {
          this.storage.ready().then(async () => {
            await this.storage.set(this.detailsKey, res);
          });
        }
      })
    );
  }
}
