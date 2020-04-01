import { Component, OnInit } from '@angular/core';
import { UserService } from '../../membership/authentication/user.service';
import { ServerService } from './server.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  private slideOptions: any;
  private continueResults = [
    {
      id: 6959,
      title: 'Game of Thrones',
      fanart: 'http://static-api.guidebox.com/041014/fanart/6959-0-0-0-208608331849-143595472413-14315259337-tv.jpg',
      poster: 'http://static-api.guidebox.com/012915/shows/posters/6959-822510668-8172091832-9724906859-600x855.jpg',
      banner: 'http://static-api.guidebox.com/041014/banner/6959-0-0-0-33769273637-89404025441-34571306376-tv.jpg',
      artwork_208x117: 'http://static-api.guidebox.com/060515/thumbnails_small/6959-7755267811-208x117.jpg',
      artwork_304x171: 'http://static-api.guidebox.com/060515/thumbnails_medium/6959-8255587010-304x171.jpg',
      artwork_448x252: 'http://static-api.guidebox.com/060515/thumbnails_large/6959-7500693383-448x252.jpg',
      artwork_608x342: 'http://static-api.guidebox.com/060515/thumbnails_xlarge/6959-423900909-608x342.jpg'
    },
    {
      id: 38948,
      title: 'Westworld',
      alternate_titles: [],
      container_show: 0,
      first_aired: '2016-10-02',
      imdb_id: 'tt0475784',
      tvdb: 296762,
      themoviedb: 63247,
      freebase: null,
      wikipedia_id: 43369485,
      tvrage: [Object],
      artwork_208x117: 'http://static-api.guidebox.com/091716/thumbnails_small/38948-4959284808-208x117.jpg',
      artwork_304x171: 'http://static-api.guidebox.com/091716/thumbnails_medium/38948-5728639164-304x171.jpg',
      artwork_448x252: 'http://static-api.guidebox.com/091716/thumbnails_large/38948-1003983417-448x252.jpg',
    },
    {
      id: 703,
      title: 'The Walking Dead',
      alternate_titles: [],
      container_show: 0,
      first_aired: '2010-10-31',
      imdb_id: 'tt1520211',
      tvdb: 153021,
      themoviedb: 1402,
      freebase: '/m/0c3xpwy',
      wikipedia_id: 27676616,
      tvrage: [Object],
      artwork_208x117: 'http://static-api.guidebox.com/091414/thumbnails_small/703-3422100935-208x117-show-thumbnail.jpg', 
      artwork_304x171: 'http://static-api.guidebox.com/091414/thumbnails_medium/703-3368183603-304x171-show-thumbnail.jpg',      artwork_448x252: 'http://static-api.guidebox.com/091414/thumbnails_large/703-4248968759-448x252-show-thumbnail.jpg', 
      artwork_608x342: 'http://static-api.guidebox.com/091414/thumbnails_xlarge/703-7681273194-608x342-show-thumbnail.jpg' 
    }
  ];
  private savedResults = [
    {
      id: 48272,
      title: 'On My Block',
      alternate_titles: [],
      container_show: 0,
      first_aired: '2018-03-16',
      imdb_id: 'tt7879820',
      tvdb: 339273,
      themoviedb: 76747,
      freebase: null,
      wikipedia_id: 56056303,
      tvrage: [Object],
      artwork_208x117: 'http://static-api.guidebox.com/100117/thumbnails_small/48272-9861293141-208x117.jpg',
      artwork_304x171: 'http://static-api.guidebox.com/100117/thumbnails_medium/48272-7404837725-304x171.jpg',
      artwork_448x252: 'http://static-api.guidebox.com/100117/thumbnails_large/48272-4731141320-448x252.jpg',
      artwork_608x342: 'http://static-api.guidebox.com/100117/thumbnails_xlarge/48272-1202965225-608x342.jpg'
    },
    {}
  ];



  constructor(private user: UserService, private server: ServerService) {
    this.slideOptions = {
      spaceBetween: 0,
      slidesPerView: 2,
      centeredSlideBounds: true
    };

  }
  ngOnInit() {
  }

}

