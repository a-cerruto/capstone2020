import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Storage } from '@ionic/storage';

import { ServerService } from '../server.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  private id: any;
  private details: any;
  private loaded: boolean;
  private slideOptions: any;

  private readonly detailsKey = 'DETAILS';

  constructor(
    private activatedRoute: ActivatedRoute,
    private storage: Storage,
    private server: ServerService
  ) {
    this.loaded = false;
    this.slideOptions = {
      spaceBetween: 0,
      slidesPerView: 2,
      centeredSlideBounds: true
    };
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.server.getShowDetails(this.id).subscribe({
      next: async res => {
        let details;
        await this.storage.remove(this.detailsKey);
        this.storage.ready().then(async () => {
          while (!details) { details = await this.storage.get(this.detailsKey); }
          this.details = details;
          this.loaded = true;
          console.log(this.details);
        });
      },
      error: err => {
        console.log(err.status);
      }
    });
  }

}
