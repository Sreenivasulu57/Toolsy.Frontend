import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { LoginType } from '../../enums/type.enum';
import { AuthService } from '../../common/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, ButtonModule, InputTextModule, ToastModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  providers: [MessageService],
})
export class Login {
  username = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  login(form: NgForm) {
    if (!form.valid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill all required fields',
        life: 3000,
      });
      return;
    }

    this.isLoading = true;

    const typeOfData: LoginType = /^\d+$/.test(this.username) ? LoginType.NUMBER : LoginType.EMAIL;

    this.authService.login(this.username, this.password, typeOfData).subscribe({
      next: () => {
        this.isLoading = false;

        const roles = this.authService.getUserRoles();

        if (roles.includes('Owner')) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Owner login successful!',
            life: 2000,
          });
          setTimeout(() => this.router.navigate(['/owner']), 500);
        } else if (roles.includes('User')) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User login successful!',
            life: 2000,
          });
          setTimeout(() => this.router.navigate(['/user']), 500);
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Unknown role detected in token.',
            life: 3000,
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: err.error?.message || 'Invalid credentials',
          life: 4000,
        });
      },
    });
  }
}
