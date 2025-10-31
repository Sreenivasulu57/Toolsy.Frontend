import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { ApiResponse } from '../models/api-response.model';
import { LoginType } from '../../enums/type.enum';
import { environment } from '../../../environments/environment';
import { DecodedToken } from '../models/Decode.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'jwtToken';

  constructor(private http: HttpClient) {}

  login(username: string, password: string, type: LoginType): Observable<string> {
    const body = { UserName: username, Password: password, Type: type };

    return this.http
      .post<ApiResponse<string>>(`${this.apiUrl}/login`, body, { withCredentials: true })
      .pipe(
        map((res) => {
          if (!res.data) throw new Error('No token returned from backend');
          return res.data;
        }),
        tap((token) => this.saveToken(token))
      );
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    return this.jwtHelper.isTokenExpired(token);
  }

  refreshToken(): Observable<void> {
    return this.http
      .post<ApiResponse<string>>(`${this.apiUrl}/refresh`, {}, { withCredentials: true })
      .pipe(
        switchMap((res) => {
          if (res.success && res.data) {
            this.saveToken(res.data);
          }
          return of(void 0);
        })
      );
  }

  private saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  getUserRoles(): string[] {
    const decoded = this.getDecodedToken();
    if (!decoded) return [];

    const roleClaim =
      decoded.role ||
      decoded['roles'] ||
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (!roleClaim) return [];

    return Array.isArray(roleClaim) ? roleClaim : [roleClaim];
  }

  getProfileId(): string | null {
    return this.getDecodedToken()?.sub || null;
  }

  getEmail(): string | null {
    const decoded = this.getDecodedToken();
    return (
      decoded?.email ||
      decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
      null
    );
  }

  isRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }
}
