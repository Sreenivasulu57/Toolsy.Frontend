import { Component, OnInit, OnDestroy } from '@angular/core';

// Define the structure for the content of the banner
interface BannerContent {
  title: string;
  subtitle: string;
  buttonText: string;
}

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  templateUrl: './landing-hero.html',
  styleUrls: ['./landing-hero.css']
})
export class LandingHero implements OnInit, OnDestroy {

  // Property to track the currently active feature/button
  activeFeature: 'free_listing' | 'connect_makers' | 'explore_tools' = 'free_listing';

  // Map of content data for each feature
  contentMap: { [key: string]: BannerContent } = {
    'free_listing': {
      title: 'List Upto 5 Tools For Free',
      subtitle: 'Get started in minutes, zero listing fees and instant visibility.',
      buttonText: 'List My Tools'
    },
    'connect_makers': {
      title: 'Fast, Secure & Reliable',
      subtitle: 'Rent or lease tools anytime with full confidence on Toolsy.',
      buttonText: 'Find Tools'
    },
    'explore_tools': {
      title: 'Explore New Tools Locally',
      subtitle: 'Discover a vast inventory of equipment and tools available for rent in your area.',
      buttonText: 'Start Browsing'
    }
  };

  // Property to hold the current content object based on activeFeature
  currentContent!: BannerContent;

  ngOnInit(): void {
    // Set initial content on load
    this.updateContent('free_listing');
  }

  ngOnDestroy(): void {
    // Cleanup logic if needed (currently none)
  }

  /**
   * Updates the banner content based on the clicked feature button.
   * @param feature A string identifier for the button clicked.
   */
  updateContent(feature: 'free_listing' | 'connect_makers' | 'explore_tools'): void {
    this.activeFeature = feature;
    this.currentContent = this.contentMap[feature];
    console.log(`Content switched to: ${feature}`);
    // You can add your actual routing/modal logic here if needed
  }

  /**
   * Alias for the method called from HTML to keep it cleaner.
   * @param feature The feature string passed from the HTML click event.
   */
  handleFeatureClick(feature: string): void {
    this.updateContent(feature as 'free_listing' | 'connect_makers' | 'explore_tools');
  }
}