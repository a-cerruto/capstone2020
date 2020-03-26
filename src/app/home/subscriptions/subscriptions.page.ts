import { Component, OnInit } from '@angular/core';
import { UserService } from '../../membership/authentication/user.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.page.html',
  styleUrls: ['./subscriptions.page.scss'],
})
export class SubscriptionsPage implements OnInit {

  subscriptions = ['Hulu', 'HBO'];

  providers = [
    {name: 'Netflix'},
    {name: 'ShowTime'}
  ];

  

  constructor(private user: UserService) { }

  ngOnInit() {
  }

}
