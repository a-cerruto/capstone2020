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

  private readonly detailsKey = 'DETAILS';
  private readonly episodesKey = 'EPISODES';
  private readonly episodeKey = 'EPISODE';

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.serverProtocol = 'http://';
    this.serverHostName = window.location.hostname;
    this.serverPort = ':3000/';

    this.serverAddress =
      this.serverProtocol +
      this.serverHostName +
      this.serverPort;
  }

  getFeaturedShows(newShowsOnly: boolean, sources: string, limit: number, prevShows: number[], storageKey: string): Observable<any> {
    const endpoint = newShowsOnly ? '/new' : '/featured';
    return this.http.post(this.serverAddress + 'shows' + endpoint, { sources, limit, prevShows }).pipe(
      tap(async (res: any) => {
        console.log(res);
        if (res) {
          await this.storage.ready();
          await this.storage.set(storageKey, res);
        }
      })
    );
  }

  getShowsByChannel(channel: string, limit: number, prevShows: number[], storageKey): Observable<any> {
    return this.http.post(this.serverAddress + 'shows/channel', { channel, limit, prevShows }).pipe(
      tap(async (res: any) => {
        console.log(res);
        if (res) {
          await this.storage.ready();
          await this.storage.set(storageKey, res);
        }
      })
    );
  }

  getShowDetails(showId: number): Observable<any> {
    return this.http.post(this.serverAddress + 'shows/details', { showId }).pipe(
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

  getEpisodes(showId: any, season: any, settings: SettingsBrowse): Observable<any> {
    return this.http.post(this.serverAddress + 'episodes', { showId, season, settings }).pipe(
      tap(async (res: any) => {
        console.log(res);
        if (res) {
          this.storage.ready().then(async () => {
            await this.storage.set(this.episodesKey, res.results);
          });
        }
      })
    );
  }

  getEpisodeDetails(episodeId: number): Observable<any> {
    return this.http.post(this.serverAddress + 'episodes/details', { episodeId }).pipe(
      tap(async (res: any) => {
        console.log(res);
        if (res) {
          this.storage.ready().then(async () => {
            await this.storage.set(this.episodeKey, res);
          });
        }
      })
    );
  }

  getMovies(settings: SettingsBrowse, storageKey): Observable<any> {
    return this.http.post(this.serverAddress + 'movies', { settings }).pipe(
      tap(async (res: any) => {
        console.log(res.results);
        if (res.results) {
          this.storage.ready().then(async () => {
            await this.storage.set(storageKey, res.results);
          });
        }
      })
    );
  }

  getMovieDetails(movieId: number, storageKey): Observable<any> {
    console.log('getMovieDetails()');
    return this.http.post(this.serverAddress + 'movies/details', { movieId }).pipe(
      tap(async (res: any) => {
        console.log(res);
        if (res) {
          this.storage.ready().then(async () => {
            await this.storage.set(storageKey, res);
          });
        }
      })
    );
  }
}
