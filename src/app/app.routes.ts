import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { UserSignup } from './pages/user/user-signup/user-signup';
import { Ownersignup } from './pages/owner/ownersignup/ownersignup';
import { User } from './pages/user/user';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'user', component: User },
  { path: 'usersignup', component: UserSignup },
  { path: 'ownersignup', component: Ownersignup },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
