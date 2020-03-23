import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.page.html',
  styleUrls: ['./subscriptions.page.scss'],
})
export class SubscriptionsPage implements OnInit {

  subscriptions = ["Hulu", "HBO"];

  providers = [
    {name: "Netflix"},
    {name: "ShowTime"}
  ];

  constructor() { }

  ngOnInit() {
  }



}
