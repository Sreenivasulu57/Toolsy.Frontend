import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { UserSignup } from './pages/user/user-signup/user-signup';
import { User } from './pages/user/user';
import { OwnerSignup } from './pages/owner/ownersignup/ownersignup';
import { Owner } from './pages/owner/owner';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'usersignup', component: UserSignup },
  { path: 'ownersignup', component: OwnerSignup },
  { path: 'owner', component: Owner },
  { path: '', component: Landing },
  {
    path: 'user',
    component: User,
    children: [
      {
        path: 'subcategory/:id/tools',
        loadComponent: () => import('./pages/user/tool-page/tool-page').then((m) => m.ToolPage),
      },
      {
        path: 'tool/:id',
        loadComponent: () =>
          import('./pages/user/tool-details/tool-details').then((m) => m.ToolDetails),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./pages/user/search-results/search-results').then((m) => m.SearchResults),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/user/user-update/user-update').then((m) => m.UserUpdate),
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
