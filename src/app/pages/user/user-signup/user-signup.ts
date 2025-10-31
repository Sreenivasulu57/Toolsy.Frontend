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
  providers: [MessageService],
})
export class UserSignup {
  Gender = Gender;

  user: RegisterUserDto = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: null,
    gender: Gender.Male,
    password: '',
  };

  confirmPassword: string = '';
  passwordMismatch = false;

  dobInputType: string = 'text';

  constructor(private userService: UserService, private messageService: MessageService) {}

  onDobFocus() {
    this.dobInputType = 'date';
  }

  onDobBlur(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    if (!input.value) {
      this.dobInputType = 'text';
    }
  }

  get userDateOfBirthString(): string {
    return this.user.dateOfBirth ? this.user.dateOfBirth.toISOString().split('T')[0] : '';
  }

  set userDateOfBirthString(value: string) {
    if (!value) {
      this.user.dateOfBirth = null;
      return;
    }

    const [year, month, day] = value.split('-').map(Number);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      this.user.dateOfBirth = new Date(Date.UTC(year, month - 1, day));
    } else {
      this.user.dateOfBirth = null;
    }
  }

  register(form: NgForm) {
    if (!form.valid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill all required fields',
        styleClass: 'custom-warn',
        life: 3000,
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
        life: 3000,
      });
      return;
    }

    this.passwordMismatch = false;

    const payload = {
      ...this.user,
      gender: Number(this.user.gender),
      dateOfBirth: this.user.dateOfBirth
        ? this.user.dateOfBirth.toISOString().split('.')[0] + 'Z'
        : null,
    } as unknown as RegisterUserDto;

    console.log('✅ Payload being sent:', payload);

    this.userService.register(payload).subscribe({
      next: (message: string) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: message,
          styleClass: 'custom-success',
          life: 3000,
        });
        form.resetForm();
        this.confirmPassword = '';
        this.dobInputType = 'text';
      },
      error: (err) => {
        console.error('❌ Registration Error:', err);
        const message = err.error?.message || 'Registration failed';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          styleClass: 'custom-error',
          life: 3000,
        });
      },
    });
  }
}
