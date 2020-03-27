import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LoadingService} from '../../global/services/loading.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private loggedIn = false;

  private id: number;
  private email: string;
  private username: string;

  constructor(
      private router: Router,
      private storage: Storage,
      private loading: LoadingService,
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
    await this.loading.getLoading('Logging out...');
    await this.authentication.logout();
    await this.loading.dismiss();
    await this.router.navigateByUrl('/login');
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  getDetails() {
    let user;
    this.storage.ready().then(async () => {
      while (!user) { user = await this.storage.get('USER'); }
      this.id = user.id;
      this.email = user.email;
      this.username = user.username;
      console.log('user: ' + user);
      console.log('id: ' + this.id);
      console.log('email: ' + this.email);
      console.log('username: ' + this.username);
    });
  }

  getId() {
    return this.id;
  }

  getEmail() {
    return this.email;
  }

  getUsername() {
    return this.username;
  }
}
