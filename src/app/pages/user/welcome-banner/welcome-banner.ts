import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome-banner',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './welcome-banner.html',
  styleUrls: ['./welcome-banner.css'],
})
export class WelcomeBanner implements OnInit {
  @Input() lastName: string = '';

  greeting: string = '';
  greetingEmoji: string = '';

  ngOnInit() {
    this.setGreeting();
  }

  private setGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      this.greeting = 'Good morning';
      this.greetingEmoji = '👋';
    } else if (hour >= 12 && hour < 17) {
      this.greeting = 'Good afternoon';
      this.greetingEmoji = '☀️';
    } else if (hour >= 17 && hour < 21) {
      this.greeting = 'Good evening';
      this.greetingEmoji = '🌆';
    } else {
      this.greeting = 'Good night';
      this.greetingEmoji = '🌙';
    }
  }
}
