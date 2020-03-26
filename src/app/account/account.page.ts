import { Component, OnInit } from '@angular/core';
import { UserService } from '../membership/authentication/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    private user: UserService
  ) { }

  ngOnInit() {
  }

}
