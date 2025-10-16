import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ElementRef, HostListener } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../common/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, AvatarModule, BadgeModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  @Input() fullName: string = 'User'; 
  @Input() profileImageUrl?: string; 
  @Input() notificationsCount: number = 0;

  dropdownOpen = false;

  constructor(private authService: AuthService, private router: Router, private el: ElementRef) {}

  ngOnInit(): void {}

  logout() {
    this.dropdownOpen = false; 
    this.authService.logout();
    this.router.navigate(['/login']); 
  }

  toggleDropdown(event: Event) {
    event.stopPropagation(); 
    this.dropdownOpen = !this.dropdownOpen;
  }

  get initials(): string {
    if (!this.profileImageUrl && this.fullName) {
      const names = this.fullName.split(' ');
      return names.map(n => n.charAt(0)).join('').toUpperCase();
    }
    return '';
  }

  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const userProfileEl = this.el.nativeElement.querySelector('.user-profile');
    if (userProfileEl && !userProfileEl.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
