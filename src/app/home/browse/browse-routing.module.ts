import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrowsePage } from './browse.page';

const routes: Routes = [
  {
    path: '',
    component: BrowsePage
  },
  {
    path: 'show/:showId',
    loadChildren: () => import('./show/show.module').then( m => m.ShowPageModule)
  },
  {
    path: 'episode/:showName/:episodeId',
    loadChildren: () => import('./episode/episode.module').then( m => m.EpisodePageModule)
  },
  {
    path: 'movie/:movieId',
    loadChildren: () => import('./movie/movie.module').then( m => m.MoviePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrowsePageRoutingModule {}
