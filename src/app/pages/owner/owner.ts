import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, ActivatedRoute } from '@angular/router';
import { filter, catchError, of, switchMap } from 'rxjs';
import { AuthService } from '../../common/services/auth.service';
import { OwnerService } from '../../common/services/owner.service';
import { Header } from '../../components/header/header/header';
import { Footer } from '../../components/footer/footer/footer';
import { Sidebar } from '../../components/sidebar/sidebar';
import { WelcomeBanner } from '../user/welcome-banner/welcome-banner';
import { ToolCatalog } from '../../components/tool-catalog/tool-catalog';
import { OwnerResponseDto } from '../../common/models/owner-response.model';

@Component({
  selector: 'app-owner',
  standalone: true,
  imports: [CommonModule, Header, Footer, Sidebar, WelcomeBanner, ToolCatalog, RouterOutlet],
  templateUrl: './owner.html',
  styleUrls: ['./owner.css'],
})
export class Owner implements OnInit {
  owner = signal<OwnerResponseDto | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  isDashboard = signal(false);

  constructor(
    private ownerService: OwnerService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadOwnerProfile();
    this.setDashboardState(this.router.url);

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.setDashboardState(e.urlAfterRedirects ?? e.url);
      });
  }

  private setDashboardState(url: string) {
    const cleaned = url.split('?')[0].replace(/\/+$/, '');
    const isExactOwner = cleaned === '/owner' || cleaned === '/owner';
    this.isDashboard.set(isExactOwner);
  }

  private loadOwnerProfile() {
    this.loading.set(true);
    this.error.set(null);

    const isExpired = this.authService.isTokenExpired();

    const profile$ = isExpired
      ? this.ownerService.refreshToken().pipe(switchMap(() => this.ownerService.getOwner()))
      : this.ownerService.getOwner();

    profile$
      .pipe(
        catchError((err) => {
          console.error('Error loading owner profile:', err);
          this.error.set('Failed to load owner profile or session expired.');
          this.loading.set(false);
          return of(null);
        })
      )
      .subscribe((response) => {
        this.owner.set(response?.data ?? null);
        this.loading.set(false);
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
