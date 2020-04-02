import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { Storage } from '@ionic/storage';

import { User } from './user';
import { Authentication } from './authentication';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  /*
  This server is only used for local development purposes.
   */
  private readonly serverProtocol: string;
  private readonly serverPort: string;
  private readonly serverHostName: string;
  private readonly serverAddress: string;

  // Keys
  private readonly tokenKey: string;
  private readonly userKey: string;

  // Authentication toggle
  private authenticationState = new BehaviorSubject(false);

  constructor(
      private http: HttpClient,
      private storage: Storage
  ) {
    // Local development server
    this.serverProtocol = 'http://';
    this.serverHostName = window.location.hostname;
    this.serverPort = ':3000/users';

    this.serverAddress =
        this.serverProtocol +
        this.serverHostName +
        this.serverPort;

    this.tokenKey = 'ACCESS_TOKEN';
    this.userKey = 'USER';
  }

  register(user: User): Observable<Authentication> {
    return this.http.post<Authentication>(this.serverAddress + '/register', user);
  }

  login(user: User): Observable<Authentication> {
    return this.http.post(this.serverAddress + '/login', user).pipe(
        tap(async (res: Authentication) => {
          if (res.user) {
            this.authenticationState.next(true);
            this.storage.ready().then(async () => {
              await this.storage.set(this.tokenKey, res.access_token);
              await this.storage.set(this.userKey, res.user);
            });
          }
        })
    );
  }

  async checkStorage() {
    let user;
    await this.storage.ready();
    user = await this.storage.get(this.userKey);
    if (user) {
      this.authenticationState.next(true);
      return true;
    }
    return false;
  }

  async logout() {
    await this.storage.remove(this.tokenKey);
    await this.storage.remove(this.userKey);
    this.authenticationState.next(false);
  }

  isLoggedIn() {
    return this.authenticationState.asObservable();
  }
}
