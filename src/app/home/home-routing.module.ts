import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'browse',
        children: [
          {
            path: '',
            loadChildren: () => import('./browse/browse.module').then( m => m.BrowsePageModule)
          }
        ]
      },
      {
        path: 'list',
        children: [
          {
            path: '',
            loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
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
        redirectTo: '/home/browse',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/browse',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
