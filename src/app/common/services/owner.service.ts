import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { OwnerRequestDto } from '../models/owner.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { LoginType } from '../../enums/type.enum';
import { OwnerResponseDto } from '../models/owner-response.model';

@Injectable({ providedIn: 'root' })
export class OwnerService {
  private apiUrl = `${environment.apiUrl}/owner`;

  constructor(private http: HttpClient, private authService: AuthService) {}
  getUserRoles(): string[] {
    return this.authService.getUserRoles();
  }

  login(username: string, password: string, type: LoginType): Observable<string> {
    return this.authService.login(username, password, type);
  }

  refreshToken(): Observable<void> {
    return this.authService.refreshToken();
  }
  registerOwner(payload: OwnerRequestDto): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/register`, payload);
  }

  getOwner(): Observable<ApiResponse<OwnerResponseDto>> {
    return this.http.get<ApiResponse<OwnerResponseDto>>(`${this.apiUrl}/by-ownerid`);
  }
}
