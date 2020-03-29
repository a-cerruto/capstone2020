import { Component, OnInit } from '@angular/core';
import { UserService } from '../../membership/authentication/user.service';
import { SubscriptionsService } from './subscriptions.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.page.html',
  styleUrls: ['./subscriptions.page.scss'],
})
export class SubscriptionsPage implements OnInit {

  private subscriptions: Array<string>;

  private providers: Array<string> = [
    'Netflix',
    'ShowTime',
    'Prime Video',
    'Starz',
    'Hulu',
    'HBO'
  ];

  private lastSelected: string;

  constructor(private user: UserService, private subscriptionDB: SubscriptionsService) { 
    this.configureSubs();
  }

  /**
   * Configures subscriptions and providers lists by getting the subscriptions
   * from the databse and removing them from the list of providers.
   */
  configureSubs(): void {
    //get the list of subs from the backend database
    this.subscriptionDB.currentSubs(this.user.getId()).toPromise().then(data => {
      this.subscriptions = data['subscriptions'];
      //Remove all providers that a user has a subscription to from providers list
      for(let subscription of this.subscriptions) {
        let index = this.providers.indexOf(subscription);
        if(index >= 0) {
          this.providers.splice(index, 1);
        }
      }
    });
  }

  removeSub(subscription): void {
    let index = this.subscriptions.indexOf(subscription);
    this.subscriptions.splice(index, 1);
    this.providers.push(subscription);
    this.subscriptionDB.removeSub(this.user.getId(), subscription).subscribe();
  }

  findLastSelected($event) {
    this.lastSelected = $event.target.value;
  }

  addSub() {
    if(this.lastSelected) {
      this.subscriptionDB.addSub(this.user.getId(), this.lastSelected).subscribe();
      let index = this.providers.indexOf(this.lastSelected);
      this.providers.splice(index, 1);
      this.subscriptions.push(this.lastSelected);
      this.lastSelected = "";
    }
  }

  ngOnInit() {
  }

}
