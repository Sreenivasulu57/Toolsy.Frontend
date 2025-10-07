import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { UserSignup } from './pages/user/user-signup/user-signup';

export const routes: Routes = [
   { path: '', component: Landing },

  // login page
  { path: 'login', component: Login },

  // signup page
  { path: 'signup', component: Signup },

  {path:'usersignup',component:UserSignup},

  // optional: wildcard to redirect unknown routes to home
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
