import { Component, OnInit } from '@angular/core';
import { UserService } from '../../membership/authentication/user.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.page.html',
  styleUrls: ['./browse.page.scss'],
})
export class BrowsePage implements OnInit {

  constructor(private user: UserService) { }

  ngOnInit() {
  }

}
