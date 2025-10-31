import { Component, OnInit, OnDestroy } from '@angular/core';

interface BannerContent {
  title: string;
  subtitle: string;
  buttonText: string;
}

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  templateUrl: './landing-hero.html',
  styleUrls: ['./landing-hero.css'],
})
export class LandingHero implements OnInit, OnDestroy {
  activeFeature: 'free_listing' | 'connect_makers' | 'explore_tools' = 'free_listing';

  contentMap: { [key: string]: BannerContent } = {
    free_listing: {
      title: 'List Upto 5 Tools For Free',
      subtitle: 'Get started in minutes, zero listing fees and instant visibility.',
      buttonText: 'List My Tools',
    },
    connect_makers: {
      title: 'Fast, Secure & Reliable',
      subtitle: 'Rent or lease tools anytime with full confidence on Toolsy.',
      buttonText: 'Find Tools',
    },
    explore_tools: {
      title: 'Explore New Tools Locally',
      subtitle: 'Discover a vast inventory of equipment and tools available for rent in your area.',
      buttonText: 'Start Browsing',
    },
  };

  currentContent!: BannerContent;

  ngOnInit(): void {
    this.updateContent('free_listing');
  }

  ngOnDestroy(): void {}

  updateContent(feature: 'free_listing' | 'connect_makers' | 'explore_tools'): void {
    this.activeFeature = feature;
    this.currentContent = this.contentMap[feature];
    console.log(`Content switched to: ${feature}`);
  }

  handleFeatureClick(feature: string): void {
    this.updateContent(feature as 'free_listing' | 'connect_makers' | 'explore_tools');
  }
}
