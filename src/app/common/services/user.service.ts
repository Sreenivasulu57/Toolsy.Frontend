import { ApiResponse } from '../models/api-response.model';
import { RegisterUserDto } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { LoginType } from '../../enums/type.enum';
import { UserResponseDto } from '../models/user-response.model';
import { UserUpdateRequestDto } from '../models/user-update.model';
import { AddressRegisterDto } from '../models/address.model';
import { map, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;
  private apiUrl2 = `${environment.apiUrl}/user/by-id`;
  private apiUrlAddress = `${environment.apiUrl}/address`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  register(user: RegisterUserDto): Observable<string> {
    const payload = {
      ...user,
      dateOfBirth:
        user.dateOfBirth instanceof Date ? user.dateOfBirth.toISOString() : user.dateOfBirth,
      gender: Number(user.gender),
    };

    return this.http
      .post<ApiResponse<any>>(`${this.apiUrl}/save`, payload)
      .pipe(map((res) => res.message));
  }

  login(username: string, password: string, type: LoginType): Observable<string> {
    return this.authService.login(username, password, type);
  }

  refreshToken(): Observable<void> {
    return this.authService.refreshToken();
  }

  getProfileId(): string | null {
    return this.authService.getProfileId();
  }

  getUserRoles(): string[] {
    return this.authService.getUserRoles();
  }

  getProfile(): Observable<UserResponseDto | null> {
    const profileId = this.getProfileId();
    if (!profileId) return of(null);
    return this.http
      .get<ApiResponse<UserResponseDto>>(`${this.apiUrl2}`)
      .pipe(map((res) => res.data ?? null));
  }

  updateUser(data: UserUpdateRequestDto): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrlAddress}/update`, data, { headers });
  }

  getAddress(): Observable<AddressRegisterDto | null> {
    return this.http
      .get<ApiResponse<AddressRegisterDto>>(`${this.apiUrlAddress}/by-profileid`)
      .pipe(map((res) => res.data ?? null));
  }

  addAddress(profileId: string, data: AddressRegisterDto): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrlAddress}/save`, data, { headers });
  }

  updateAddress(profileId: string, data: AddressRegisterDto): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrlAddress}/update`, data, { headers });
  }
}
