import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Storage } from '@ionic/storage';

import { ServerService } from '../../services/server.service';
import { UserService } from '../../../membership/authentication/user.service';

@Component({
  selector: 'app-episode',
  templateUrl: './episode.page.html',
  styleUrls: ['./episode.page.scss'],
})
export class EpisodePage implements OnInit {

  private showName: string;
  private episodeId: any;
  private details: any;
  private linkKey: string;
  private episodeLink: string;
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
    this.showName = this.activatedRoute.snapshot.paramMap.get('showName');
    this.episodeId = this.activatedRoute.snapshot.paramMap.get('episodeId');
    this.server.getEpisodeDetails(this.episodeId).subscribe({
      next: async res => {
        let details;
        await this.storage.remove(this.episodeKey);
        this.storage.ready().then(async () => {
          while (!details) { details = await this.storage.get(this.episodeKey); }
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
      this.episodeLink = this.details.free_web_sources[0].link;
    } else if (this.details.subscription_web_sources.length > 0) {
      this.linkKey = 'subscription';
      this.episodeLink = this.details.subscription_web_sources[0].link;
    } else if (this.details.purchase_web_sources.length > 0) {
      this.linkKey = 'purchase';
      this.episodeLink = this.details.purchase_web_sources[0].link;
    } else {
      this.episodeLink = '';
    }
  }

  selectSource(event) {
    switch (event) {
      case 'free': this.episodeLink = this.details.free_web_sources[0].link; break;
      case 'subscription': this.episodeLink = this.details.subscription_web_sources[0].link; break;
      case 'purchase': this.episodeLink = this.details.purchase_web_sources[0].link; break;
    }
  }
}
