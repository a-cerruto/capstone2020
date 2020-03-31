import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Storage } from '@ionic/storage';

import { ServerService } from '../server.service';
import { UserService } from '../../../membership/authentication/user.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  private id: any;
  private details: any;
  private season: any;
  private episodes: any;
  private loaded: boolean;
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
    this.loaded = false;
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
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.server.getShowDetails(this.id).subscribe({
      next: async res => {
        let details;
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
    this.server.getEpisodes(this.id, this.season, this.user.getBrowserSettings()).subscribe({
      next: async res => {
        let episodes;
        await this.storage.remove(this.episodesKey);
        this.storage.ready().then(async () => {
          while (!episodes) { episodes = await this.storage.get(this.episodesKey); }
          this.episodes = episodes;
          this.loaded = true;
        });
      },
      error: err => {
        console.log(err.status);
      }

    });
  }


}
