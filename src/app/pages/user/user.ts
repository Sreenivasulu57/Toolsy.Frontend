import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';
import { UserService } from '../../common/services/user.service';
import { AuthService } from '../../common/services/auth.service';
import { UserResponseDto } from '../../common/models/user-response.model';
import { Header } from "../../components/header/header/header";
import { Footer } from "../../components/footer/footer/footer";
import { Sidebar } from '../../components/sidebar/sidebar';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, Header, Footer, Sidebar],
  templateUrl: './user.html',
  styleUrls: ['./user.css']
})
export class User implements OnInit {
  user: UserResponseDto | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  private loadUserProfile() {
    this.loading = true;
    this.error = null;

 
    const isExpired = this.authService.isTokenExpired();

    const profile$ = isExpired
      ? this.userService.refreshToken().pipe(
          switchMap(() => this.userService.getProfile())
        )
      : this.userService.getProfile();

    profile$
      .pipe(
        catchError((err) => {
          console.error('Error loading user profile:', err);
          this.error = 'Session expired or failed to load user data.';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe((user) => {
        this.user = user;
        this.loading = false;
        if (!user) {
          this.error = 'No user profile found.';
        }
      });
  }
}
