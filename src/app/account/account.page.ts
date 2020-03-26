import { Component, OnInit } from '@angular/core';
import { UserService } from '../membership/authentication/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  private canEdit: boolean;

  constructor(
    private user: UserService
  ) {
    this.canEdit = false;
  }

  ngOnInit() {
  }

  toggleEdit() {
    this.canEdit = !this.canEdit;
  }
}
