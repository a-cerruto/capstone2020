import { Component, OnInit } from '@angular/core';
import { UserService } from '../../membership/authentication/user.service';
import { SubscriptionsService } from './subscriptions.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.page.html',
  styleUrls: ['./subscriptions.page.scss'],
})
export class SubscriptionsPage implements OnInit {

  ionViewWillEnter(){
    this.configureSubs();
  }

  private subscriptions: Array<string>;
  private recommendationScores: any;

  private providers: Array<string> = [
    'Amazon Prime',
    'HBO Now',
    'Hulu+',
    'Netflix',
    'Apple TV+',
    'CBS All Access',
    'Disney+'
  ];

  private lastSelected: string;

  constructor(private user: UserService, private subscriptionDB: SubscriptionsService) {
    this.configureSubs();
  }

  /**
   * Configures subscriptions and providers lists by getting the subscriptions
   * from the databse and removing them from the list of providers.
   */
  async configureSubs() {
    // get the list of subs from the backend database
    await this.subscriptionDB.currentSubs(this.user.getId()).toPromise().then(data => {
      this.subscriptions = data['subscriptions'];
      // Remove all providers that a user has a subscription to from providers list
      for (const subscription of this.subscriptions) {
        const index = this.providers.indexOf(subscription);
        if (index >= 0) {
          this.providers.splice(index, 1);
        }
      }
      this.configureRecommendations();
    });
  }

  async configureRecommendations() {
    await this.subscriptionDB.getRecommendations(this.user.getId(), this.subscriptions).toPromise().then(data => {
      this.recommendationScores = data;
      for (const subscription of this.subscriptions) {
        let score = false;
        for(const recommendationScore of this.recommendationScores) {
          if(subscription == recommendationScore.provider) {
            score = true
          }
        }
        if(!score) {
          this.recommendationScores.push({provider: subscription, score: 0});
        }
      }
      
    });
  }

  removeSub(subscription): void {
    const index = this.subscriptions.indexOf(subscription);
    this.subscriptions.splice(index, 1);
    this.providers.push(subscription);
    this.subscriptionDB.removeSub(this.user.getId(), subscription).subscribe();
    this.configureRecommendations();
  }

  findLastSelected($event) {
    this.lastSelected = $event.target.value;
  }

  addSub() {
    if (this.lastSelected) {
      this.subscriptionDB.addSub(this.user.getId(), this.lastSelected).subscribe();
      const index = this.providers.indexOf(this.lastSelected);
      this.providers.splice(index, 1);
      this.subscriptions.push(this.lastSelected);
      this.lastSelected = '';
      this.configureRecommendations();
    }
  }

  ngOnInit() {
  }

}
