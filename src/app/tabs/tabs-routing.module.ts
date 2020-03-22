import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'my-list',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../my-list/my-list.module').then(m => m.MyListPageModule)
          }
        ]
      },
      {
        path: 'subscriptions',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../subscriptions/subscriptions.module').then(m => m.SubscriptionsPageModule)
          }
        ]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
