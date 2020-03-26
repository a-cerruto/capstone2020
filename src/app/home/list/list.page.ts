import { Component, OnInit } from '@angular/core';
import { UserService } from '../../membership/authentication/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  constructor(private user: UserService) { }

  ngOnInit() {
  }

}
