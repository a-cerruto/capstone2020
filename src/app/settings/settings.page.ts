import { Component, OnInit, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage';

import { LoadingService } from '../global/services/loading.service';
import { ToastService } from '../global/services/toast.service';

import { SettingsService } from './settings.service';
import { UserService } from '../membership/authentication/user.service';

import { SettingsBrowse } from './interfaces/settings-browse';
import { Option } from './interfaces/option';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  // Slide #1
  private slideOptions = {
    slidesPerView: 1,
    spaceBetween: 1000,
    allowSlidePrev: false,
    allowSlideNext: false
  };
  private channelListOptions = [
    {
      title: 'All',
      value: 'all',
    },
    {
      title: 'My Subscriptions',
      value: 'subscription'
    },
    {
      title: 'Custom',
      value: 'custom'
    }
  ];

  private channelOptions: any;
  private sourceOptions: any;
  private platformOptions: any;
  private channels: Option[];
  private sources: Option[];
  private platforms: Option[];
  private storedSubscription: any;
  private userBrowseSettings: SettingsBrowse;

  constructor(
    private storage: Storage,
    private loading: LoadingService,
    private toast: ToastService,
    private settings: SettingsService,
    private user: UserService
  ) {}


  ngOnInit() {
    this.loading.getLoading().then(() => {
      this.settings.getAvailableOptions().subscribe({
        next: res => {
          console.log(res);
          if (res) {
            this.channelOptions = res.available_channels;
            this.sourceOptions = res.available_sources;
            this.platformOptions = res.available_platforms;
          }
        },
        error: err => {
          console.log(err.status);
          this.toast.showError(err.status);
        }
      });
      this.storedSubscription = this.user.areSettingsStored().subscribe(async stored => {
        if (stored) {
          this.channels = [];
          this.sources = [];
          this.platforms = [];
          this.userBrowseSettings = this.user.getBrowseSettings();
          this.userBrowseSettings.options.forEach((option: Option) => {
            switch (option.type) {
              case 'channel': this.channels.push(option); break;
              case 'source': this.sources.push(option); break;
              case 'platform': this.platforms.push(option); break;
            }
          });
          this.loading.dismiss().then();
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.storedSubscription) {
      this.storedSubscription.unsubscribe();
    }
  }

  async refreshSettings(event) {
    await this.user.initSettings();
    event.target.complete();
  }

  selectChannels(listType) {
    switch (listType) {
      case this.channelListOptions[0].value:
        this.updateSettings('channelList', this.channelListOptions[0].value);
        this.updateOptions('channel', this.channelOptions);
        break;
      case this.channelListOptions[1].value:
        this.updateSettings('channelList', this.channelListOptions[1].value);
        break;
      case this.channelListOptions[2].value:
        this.updateSettings('channelList', this.channelListOptions[2].value);
        break;
    }
  }

  checkForAlreadySelected(alreadySelected, option) {
    const values = [];
    alreadySelected.forEach(selected => {
      values.push(selected.value);
    });
    return values.indexOf(option.value) !== -1;
  }

  updateSettings(key, value) {
    this.user.setBrowseSettings(key, value.toString());
  }

  updateOptions(type, options) {
    this.user.setOptionsSettings(type, options);
  }

  updateList(addToList, type, options) {
    let currentOptions;
    switch (type) {
      case 'channel':
        currentOptions = this.channels;
        break;
      case 'source':
        currentOptions = this.sources;
        break;
      case 'platform':
        currentOptions = this.platforms;
        break;
    }
    let index;
    if (addToList) {
      options.forEach(channel => {
        currentOptions.push(channel);
      });
    } else {
      index = currentOptions.indexOf(options);
      currentOptions.splice(index, 1);
    }
    this.updateOptions(type, currentOptions);
  }

  // Slide #2


}
