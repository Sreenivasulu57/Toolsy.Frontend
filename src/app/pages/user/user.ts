import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterOutlet } from '@angular/router';
import { filter, catchError, of, switchMap } from 'rxjs';
import { UserService } from '../../common/services/user.service';
import { AuthService } from '../../common/services/auth.service';
import { UserResponseDto } from '../../common/models/user-response.model';
import { Header } from '../../components/header/header/header';
import { Footer } from '../../components/footer/footer/footer';
import { Sidebar } from '../../components/sidebar/sidebar';
import { WelcomeBanner } from './welcome-banner/welcome-banner';
import { ToolCatalog } from '../../components/tool-catalog/tool-catalog';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, Header, Footer, Sidebar, WelcomeBanner, ToolCatalog, RouterOutlet],
  templateUrl: './user.html',
  styleUrls: ['./user.css'],
})
export class User implements OnInit {
  user = signal<UserResponseDto | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);


  isDashboard = signal<boolean>(false);

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadUserProfile();

   
    this.setDashboardState(this.router.url);

   
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.setDashboardState(e.urlAfterRedirects ?? e.url);
      });
  }


  private setDashboardState(url: string) {

    const cleaned = url.split('?')[0].replace(/\/+$/, '');

    const isExactUser = cleaned === '/user' || cleaned === '/user';
    this.isDashboard.set(isExactUser);

    console.debug('[User] setDashboardState', { url, cleaned, isExactUser, routerUrl: this.router.url });
  }

  private loadUserProfile() {
    this.loading.set(true);
    this.error.set(null);

    const isExpired = this.authService.isTokenExpired();

    const profile$ = isExpired
      ? this.userService.refreshToken().pipe(switchMap(() => this.userService.getProfile()))
      : this.userService.getProfile();

    profile$
      .pipe(
        catchError((err) => {
          console.error('Error loading user profile:', err);
          this.error.set('Session expired or failed to load user data.');
          this.loading.set(false);
          return of(null);
        })
      )
      .subscribe((user) => {
        this.user.set(user);
        this.loading.set(false);
        if (!user) this.error.set('No user profile found.');
      });
  }

  logout(): void {
    this.authService.logout();
  }
}
