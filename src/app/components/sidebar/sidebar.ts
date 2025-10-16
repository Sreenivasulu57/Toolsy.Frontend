import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';


interface NavLink {
  label: string;
  path: string;
  icon?: string; 
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar implements OnInit {
  @Input() appTitle: string = 'Toolsy';
  role: string = '';
  navLinks: NavLink[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const roles = this.authService.getUserRoles();
    if (roles.includes('Admin')) {
      this.role = 'Admin';
      this.navLinks = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: 'pi pi-home' },
        { label: 'Users', path: '/admin/users', icon: 'pi pi-users' },
        { label: 'Reports', path: '/admin/reports', icon: 'pi pi-chart-line' },
      ];
    } else if (roles.includes('Owner')) {
      this.role = 'Owner';
      this.navLinks = [
        { label: 'Dashboard', path: '/owner/dashboard', icon: 'pi pi-home' },
        { label: 'Tools', path: '/owner/tools', icon: 'pi pi-tools' },
        { label: 'Bookings', path: '/owner/bookings', icon: 'pi pi-calendar' },
      ];
    } else if (roles.includes('Operator')) {
      this.role = 'Operator';
      this.navLinks = [
        { label: 'Dashboard', path: '/operator/dashboard', icon: 'pi pi-home' },
        { label: 'Active Jobs', path: '/operator/jobs', icon: 'pi pi-briefcase' },
      ];
    } else {
      this.role = 'User';
      this.navLinks = [
        { label: 'Dashboard', path: '/user/dashboard', icon: 'pi pi-home' },
        { label: 'Search Tools', path: '/user/search', icon: 'pi pi-search' },
        { label: 'Favorites', path: '/user/favorites', icon: 'pi pi-heart' },
        { label: 'Bookings', path: '/user/bookings', icon: 'pi pi-calendar' },
        { label: 'Profile', path: '/user/profile', icon: 'pi pi-user' },
      ];
    }
  }
}
