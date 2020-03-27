import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Storage } from '@ionic/storage';

import { UserService } from '../membership/authentication/user.service';
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
    private storage: Storage,
    private user: UserService
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
            this.storage.set('USER', res).then(() => {
              this.user.getDetails();
            });
          });
        }
      })
    );
  }
}

