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

  private id;
  private details;

  private detailsKey = 'DETAILS';

  constructor(
    private activatedRoute: ActivatedRoute,
    private storage: Storage,
    private server: ServerService
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.server.getShowDetails(this.id).subscribe({
      next: async res => {
        let details;
        await this.storage.remove(this.detailsKey);
        this.storage.ready().then(async () => {
          while (!details) { details = await this.storage.get(this.detailsKey); }
          this.details = details;
          console.log(this.details);
        });
      },
      error: err => {
        console.log(err.status);
      }
    });
  }

}
