import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Storage } from '@ionic/storage';

import { ServerService } from '../../services/server.service';
import { UserService } from '../../../membership/authentication/user.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.page.html',
  styleUrls: ['./movie.page.scss'],
})
export class MoviePage implements OnInit {

  private movieId: any;
  private details: any;
  private linkKey: string;
  private movieLink: string;
  private slideOptions: any;
  private loaded: boolean;

  private readonly movieKey = 'MOVIE';

  constructor(
    private activatedRoute: ActivatedRoute,
    private storage: Storage,
    private server: ServerService,
    private user: UserService
  ) {
    this.loaded = false;
    this.slideOptions = {
      spaceBetween: 0,
      slidesPerView: 2,
      centeredSlideBounds: true
    };
  }

  ngOnInit() {
    this.movieId = this.activatedRoute.snapshot.paramMap.get('movieId');
    this.server.getMovieDetails(this.movieId, this.movieKey).subscribe({
      next: async res => {
        let details;
        await this.storage.remove(this.movieKey);
        this.storage.ready().then(async () => {
          while (!details) { details = await this.storage.get(this.movieKey); }
          this.details = details;
          this.setDefaultSource().then(() => {
            this.loaded = true;
          });
        });
      },
      error: err => {
        console.log(err.status);
      }
    });
  }

  async setDefaultSource() {
    if (this.details.free_web_sources.length > 0) {
      this.linkKey = 'free';
      this.movieLink = this.details.free_web_sources[0].link;
    } else if (this.details.subscription_web_sources.length > 0) {
      this.linkKey = 'subscription';
      this.movieLink = this.details.subscription_web_sources[0].link;
    } else if (this.details.purchase_web_sources.length > 0) {
      this.linkKey = 'purchase';
      this.movieLink = this.details.purchase_web_sources[0].link;
    } else {
      this.movieLink = '';
    }
  }


    selectSource(event) {
    switch (event) {
      case 'free': this.movieLink = this.details.free_web_sources[0].link; break;
      case 'subscription': this.movieLink = this.details.subscription_web_sources[0].link; break;
      case 'purchase': this.movieLink = this.details.purchase_web_sources[0].link; break;
    }
  }

}
