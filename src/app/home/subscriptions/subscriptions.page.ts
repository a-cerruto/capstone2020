import { Component, OnInit } from '@angular/core';
import { UserService } from '../../membership/authentication/user.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.page.html',
  styleUrls: ['./subscriptions.page.scss'],
})
export class SubscriptionsPage implements OnInit {

  private subscriptions: Array<string>;

  private providers: Array<String> = [
    'Netflix',
    'ShowTime',
    'Prime Video',
    'Starz',
    'Hulu',
    'HBO'
  ];

  private lastSelected: string;

  constructor(private user: UserService) { 
    this.subscriptions = this.getCurrentSubs();
    //Remove all providers that a user has a subscription to from providers list
    for(let subscription of this.subscriptions) {
      let index = this.providers.indexOf(subscription);
      if(index) {
        this.providers.splice(index, 1)
      }
    }
  }

  getCurrentSubs(): Array<string> {
    //get the list of subs from the backend database
    return ['Hulu', 'HBO'];
  }

  removeSub(subscription): void {
    let index = this.subscriptions.indexOf(subscription);
    this.subscriptions.splice(index, 1);
    this.providers.push(subscription);
    //Remove from the database
  }

  findLastSelected($event) {
    this.lastSelected = $event.target.value;
  }

  addSub() {
    if(this.lastSelected) {
      let index = this.providers.indexOf(this.lastSelected);
      this.providers.splice(index, 1);
      this.subscriptions.push(this.lastSelected);
      //Add this value to the database of providers user is subscribed to

      this.lastSelected = "";
    }
  }

  ngOnInit() {
  }

}
