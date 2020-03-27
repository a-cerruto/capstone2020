import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Storage } from '@ionic/storage';

import { User } from '../membership/authentication/user';
import { UserUpdateData } from './user-update-data';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

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
    this.serverPort = ':3000/users';

    this.serverAddress =
      this.serverProtocol +
      this.serverHostName +
      this.serverPort;
  }

  updateEmail(userData: UserUpdateData): Observable<User> {
    return this.http.post<User>(this.serverAddress + '/update/email', userData).pipe(
      tap(async (res: User) => {
        if (res) {
          this.storage.ready().then(async () => {
            await this.storage.set('USER', res);
          });
        }
      })
    );
  }
}

