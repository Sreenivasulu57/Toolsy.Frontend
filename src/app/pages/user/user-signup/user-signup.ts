import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../common/services/user.service';
import { RegisterUserDto } from '../../../common/models/user.model';
import { Gender } from '../../../enums/gender.enum';

@Component({
  selector: 'app-user-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, ToastModule],
  templateUrl: './user-signup.html',
  styleUrls: ['./user-signup.css'],
  providers: [MessageService] 
})
export class UserSignup {
  Gender = Gender;

  user: RegisterUserDto = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: new Date(),
    gender: Gender.Male,
    password: '',
  };

  confirmPassword: string = '';
  passwordMismatch = false;

  constructor(private userService: UserService, private messageService: MessageService) {}

  
  get userDateOfBirthString(): string {
    return this.user.dateOfBirth
      ? this.user.dateOfBirth.toISOString().split('T')[0]
      : '';
  }

  set userDateOfBirthString(value: string) {
    const [year, month, day] = value.split('-').map(Number);
    this.user.dateOfBirth = new Date(Date.UTC(year, month - 1, day));
  }

  register(form: NgForm) {
    if (!form.valid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill all required fields',
        styleClass: 'custom-warn', 
        life: 3000
      });
      return;
    }

    if (this.user.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Passwords do not match',
        styleClass: 'custom-warn', 
        life: 3000
      });
      return;
    }

    this.passwordMismatch = false;

   
    const payload = {
      ...this.user,
      gender: Number(this.user.gender),
      dateOfBirth: this.user.dateOfBirth.toISOString().split('.')[0] + 'Z',
    } as unknown as RegisterUserDto; 

    console.log('✅ Payload being sent:', payload);

    this.userService.register(payload).subscribe({
      next: (message: string) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: message,
          styleClass: 'custom-success', 
          life: 3000
        });
        form.resetForm();
        this.confirmPassword = '';
      },
      error: (err) => {
        console.error('❌ Registration Error:', err);
        const message = err.error?.message || 'Registration failed';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          styleClass: 'custom-error', 
          life: 3000
        });
      },
    });
  }
}
