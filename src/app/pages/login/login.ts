import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService } from '../../common/services/user.service';
import { CommonModule } from '@angular/common';
import { LoginType } from '../../enums/type.enum';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, ButtonModule, InputTextModule, ToastModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  providers: [MessageService]  
})
export class Login {
  username: string = '';
  password: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) {}

  login(form: NgForm) {
    if (!form.valid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill all required fields',
        life: 3000
      });
      return;
    }

  
    const typeOfData: LoginType = /^\d+$/.test(this.username) ? LoginType.NUMBER : LoginType.EMAIL;

    this.userService.login(this.username, this.password, typeOfData).subscribe({
      next: () => {
      
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful!',
          life: 3000 
        });

      
        setTimeout(() => this.router.navigate(['/user']), 500);
      },
      error: (err) => {
       
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Login failed',
          life: 4000
        });
      }
    });
  }
}
