// src/app/pages/landing/landing.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Footer } from '../../components/footer/footer/footer';
import { LandingHeader } from './landing.header/landing.header';
import { App } from "../../app";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    Footer,
    LandingHeader,
    CommonModule,
    RouterLink,
    RouterOutlet,
    App
],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class Landing {
  landingLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  authLinks = [
    { label: 'Login', path: '/login' },
    { label: 'Signup', path: '/signup' }
  ];
}
