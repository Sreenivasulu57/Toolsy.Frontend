import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './landing.header.html',
  styleUrl: './landing.header.css',
})
export class LandingHeader {
  @Input() navLinks: { label: string; path: string }[] = [];
  @Input() authLinks:{label:string;path:string}[]=[]
}
