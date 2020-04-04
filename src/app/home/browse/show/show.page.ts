import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Storage } from '@ionic/storage';

import { ServerService } from '../server.service';
import { UserService } from '../../../membership/authentication/user.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.page.html',
  styleUrls: ['./show.page.scss'],
})
export class ShowPage implements OnInit {

  private showId: any;
  private details: any;
  private season: any;
  private episodes: any;
  private backdrop: boolean;
  private slideOptions: any;
  private episodeSlideOptions: any;

  private readonly detailsKey = 'DETAILS';
  private readonly episodesKey = 'EPISODES';

  constructor(
    private activatedRoute: ActivatedRoute,
    private storage: Storage,
    private server: ServerService,
    private user: UserService
  ) {
    this.season = 1;
    this.backdrop = true;
    this.slideOptions = {
      spaceBetween: 0,
      slidesPerView: 2,
      centeredSlideBounds: true
    };
    this.episodeSlideOptions = {
      spaceBetween: 0,
      slidesPerView: 1,
      centeredSlideBound: true
    };
  }

  ngOnInit() {
    this.showId = this.activatedRoute.snapshot.paramMap.get('showId');
    this.server.getShowDetails(this.showId).subscribe({
      next: async res => {
        let details;
        await this.storage.remove(this.detailsKey);
        this.storage.ready().then(async () => {
          while (!details) { details = await this.storage.get(this.detailsKey); }
          this.details = details;
          this.getEpisodes();
        });
      },
      error: err => {
        console.log(err.status);
      }
    });
  }

  async getEpisodes() {
    this.server.getEpisodes(this.showId, this.season, this.user.getBrowseSettings()).subscribe({
      next: async res => {
        let episodes;
        await this.storage.remove(this.episodesKey);
        this.storage.ready().then(async () => {
          while (!episodes) { episodes = await this.storage.get(this.episodesKey); }
          this.episodes = episodes;
          this.backdrop = false;
        });
      },
      error: err => {
        console.log(err.status);
      }

    });
  }
}
