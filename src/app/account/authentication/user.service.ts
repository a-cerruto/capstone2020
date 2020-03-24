import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private loggedIn = false;

  private id: string;
  private name: string;

  constructor(
      private storage: Storage,
      private authentication: AuthenticationService
  ) {
    this.authentication.isLoggedIn().subscribe(async loggedIn => {
      console.log('User is logged in: ' + loggedIn);
      this.loggedIn = loggedIn;
      if (this.loggedIn) {
        this.getDetails();
      }
    });
  }

  login(form) {
    return this.authentication.login(form.value);
  }

  async logout() {
    await this.authentication.logout();
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  getDetails() {
    let user;
    this.storage.ready().then(async () => {
      user = await this.storage.get('USER');
      this.id = user.id;
      this.name = user.name;
      console.log('user: ' + user);
      console.log('id: ' + this.id);
      console.log('name: ' + this.name);
    });
  }
}
