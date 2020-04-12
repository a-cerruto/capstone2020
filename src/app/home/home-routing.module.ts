import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'shows',
        children: [
          {
            path: '',
            loadChildren: () => import('./shows/shows.module').then( m => m.ShowsPageModule)
          }
        ]
      },
      {
        path: 'movies',
        children: [
          {
            path: '',
            loadChildren: () => import('./movies/movies.module').then( m => m.MoviesPageModule)
          }
        ]
      },
      {
        path: 'portal',
        children: [
          {
            path: '',
            loadChildren: () => import('./portal/portal.module').then( m => m.PortalPageModule)
          }
        ]
      },
      {
        path: 'subscriptions',
        children: [
          {
            path: '',
            loadChildren: () => import('./subscriptions/subscriptions.module').then( m => m.SubscriptionsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/home/shows',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/shows',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
