import { Component, OnInit } from '@angular/core';

import { UserService } from '../../membership/authentication/user.service';
import { SettingsService } from '../settings.service';

import { SettingsBrowse } from '../interfaces/settings-browse';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.page.html',
  styleUrls: ['./browse.page.scss'],
})
export class BrowsePage implements OnInit {

  private browserSettings: SettingsBrowse;

  constructor(
    private user: UserService,
    private settings: SettingsService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
  }

}
