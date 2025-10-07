import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../../common/services/user.service'; 
import { RegisterUserDto } from '../../../common/models/user.model'; 
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
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
  user: RegisterUserDto = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: new Date(),
    gender: Gender.Male,
    password: '',
    profileImageUrl: ''
  };

  constructor(private userService: UserService, private messageService: MessageService) {}

  register(form: NgForm) {
    if (form.valid) {
      this.userService.register(this.user).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User registered!' });
          form.resetForm();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Registration failed' });
        },
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill all required fields' });
    }
  }
}
