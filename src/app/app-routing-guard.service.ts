import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from './membership/authentication/user.service';

@Injectable({
  providedIn: 'root'
})
export class AppRoutingGuardService implements CanActivate {

  constructor(
      private router: Router,
      private user: UserService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.user.isLoggedIn()) {
      this.router.navigateByUrl('login');
      return false;
    }
    return true;
  }
}
