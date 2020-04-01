import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrowsePage } from './browse.page';

const routes: Routes = [
  {
    path: '',
    component: BrowsePage
  },
  {
    path: ':showId',
    loadChildren: () => import('./details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: ':showName/:episodeId',
    loadChildren: () => import('./episode/episode.module').then( m => m.EpisodePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrowsePageRoutingModule {}
