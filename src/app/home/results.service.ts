import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { Storage } from '@ionic/storage';

import { SettingsBrowse } from '../settings/interfaces/settings-browse';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  private readonly serverProtocol: string;
  private readonly serverPort: string;
  private readonly serverHostName: string;
  private readonly serverAddress: string;

  private readonly featuredShowsStored = new BehaviorSubject(false);
  private readonly channelShowsStored = new BehaviorSubject(false);
  private readonly featuredMoviesStored = new BehaviorSubject(false);
  private readonly channelMoviesStored = new BehaviorSubject(false);
  private featuredShows = 0;
  private channelShows = 0;
  private featuredMovies = 0;
  private channelMovies = 0;

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

  async getStorage(key) {
    await this.storage.ready();
    return await this.storage.get(key);
  }

  async setStorage(key, value) {
    await this.storage.ready();
    await this.storage.set(key, value);
  }

  async featured(type, newOnly, sources, limit, prevResults, storageKey, checkStorage, totalFeatured) {
    if (checkStorage) {
      const results = await this.getStorage(storageKey);
      // tslint:disable-next-line:max-line-length
      results ? await this.countFeaturedResults(type, totalFeatured) : await this.featured(type, newOnly, sources, limit, prevResults, storageKey, false, totalFeatured);
    } else {
      await this.getFeaturedResults(type, newOnly, sources, limit, prevResults, storageKey).subscribe({
        next: res => this.countFeaturedResults(type, totalFeatured),
        error: err => console.log(err)
      });
    }
  }

  async countFeaturedResults(type, totalFeatured) {
    if (type === 'shows') {
      this.featuredShows += 1;
      if (this.featuredShows === totalFeatured) {
        this.featuredShowsStored.next(true);
        this.featuredShows = 0;
      }
    } else if (type === 'movies') {
      this.featuredMovies += 1;
      if (this.featuredMovies === totalFeatured) {
        this.featuredMoviesStored.next(true);
        this.featuredMovies = 0;
      }
    }
  }

  areFeaturedShowsStored() {
    return this.featuredShowsStored.asObservable();
  }

  areFeaturedMoviesStored() {
    return this.featuredMoviesStored.asObservable();
  }

  // tslint:disable-next-line:max-line-length
  getFeaturedResults(endpoint: string, newOnly: boolean, sources: string[], limit: number, prevResults: number[], storageKey: string): Observable<any> {
    endpoint += newOnly ? '/new' : '/featured';
    return this.http.post(this.serverAddress + endpoint, { sources, limit, prevResults }).pipe(
      tap(async (res: any) => {
        console.log(res);
        if (res) {
          await this.setStorage(storageKey, res);
        }
      })
    );
  }

  async byChannel(type, channel, limit, prevShows, storageKey, checkStorage, totalChannels) {
    if (checkStorage) {
      const results = await this.getStorage(storageKey);
      // tslint:disable-next-line:max-line-length
      results ? await this.countChannelResults(type, totalChannels) : await this.byChannel(type, channel, limit, prevShows, storageKey, false, totalChannels);
    } else {
      this.getResultsByChannel(type, channel, limit, prevShows, storageKey).subscribe({
        next: res => this.countChannelResults(type, totalChannels),
        error: err => console.log(err)
      });
    }
  }

  async countChannelResults(type, totalChannels) {
    if (type === 'shows') {
      this.channelShows += 1;
      if (this.channelShows === totalChannels) {
        this.channelShowsStored.next(true);
        this.channelShows = 0;
      }
    } else if (type === 'movies') {
      this.channelMovies += 1;
      if (this.channelMovies === totalChannels) {
        this.channelMoviesStored.next(true);
        this.channelMovies = 0;
      }
    }
  }

  areChannelShowsStored() {
    return this.channelShowsStored.asObservable();
  }

  areChannelMoviesStored() {
    return this.channelMoviesStored.asObservable();
  }

  getResultsByChannel(endpoint: string, channel: string, limit: number, prevResults: number[], storageKey): Observable<any> {
    return this.http.post(this.serverAddress + endpoint + '/channel', { channel, limit, prevResults }).pipe(
      tap(async (res: any) => {
        console.log(res);
        if (res) {
          await this.setStorage(storageKey, res);
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
            // await this.storage.set(this.detailsKey, res);
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
            // await this.storage.set(this.episodesKey, res.results);
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
            // await this.storage.set(this.episodeKey, res);
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
