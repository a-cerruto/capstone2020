import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Storage } from '@ionic/storage';

import { ServerService } from '../server.service';
import { UserService } from '../../../membership/authentication/user.service';

@Component({
  selector: 'app-episode',
  templateUrl: './episode.page.html',
  styleUrls: ['./episode.page.scss'],
})
export class EpisodePage implements OnInit {

  private episodeId: any;
  private details: any;
  private loaded: boolean;

  private readonly episodeKey = 'EPISODE';

  constructor(
    private activatedRoute: ActivatedRoute,
    private storage: Storage,
    private server: ServerService,
    private user: UserService
  ) {
    this.loaded = false;
  }

  ngOnInit() {
    this.episodeId = this.activatedRoute.snapshot.paramMap.get('id');
    this.server.getEpisodeDetails(this.episodeId).subscribe({
      next: async res => {
        let details;
        this.storage.ready().then(async () => {
          while (!details) { details = await this.storage.get(this.episodeKey); }
          this.details = details;
          this.loaded = true;
        });
      },
      error: err => {
        console.log(err.status);
      }
    });
  }

}
