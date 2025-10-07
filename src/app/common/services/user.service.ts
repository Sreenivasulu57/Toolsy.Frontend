import { Injectable } from '@angular/core';
import { RegisterUserDto } from '../models/user.model';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`; // use environment

  constructor(private http: HttpClient) {}

  register(user: RegisterUserDto): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, user).pipe(
      tap(res => localStorage.setItem('jwtToken', res.token))
    );
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  logout() {
    localStorage.removeItem('jwtToken');
  }
}
