import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  private slideOptions: any;
  private channelOptions = ['1', '2', '3', '4'];
  private sourceOptions = ['1', '2', '3', '4'];
  private platformOptions = ['Web', 'iOS', 'Android'];

  constructor() {
    this.slideOptions = {
      slidesPerView: 1,
      spaceBetween: 0
    };
  }


  ngOnInit() {
  }

  changeSlide(value) {
    console.log(value);
  }

}
