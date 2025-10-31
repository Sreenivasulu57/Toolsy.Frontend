import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { OwnerService } from '../../../common/services/owner.service';
import { Gender } from '../../../enums/gender.enum';
import { OwnerRequestDto } from '../../../common/models/owner.model';

@Component({
  selector: 'app-owner-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, PasswordModule, ToastModule],
  templateUrl: './ownersignup.html',
  styleUrls: ['./ownersignup.css'],
  providers: [MessageService],
})
export class OwnerSignup {
  Gender = Gender;

  owner: OwnerRequestDto = {
    businessName: '',
    businessDescription: '',
    businessRegistrationNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: new Date(),
    gender: Gender.Male,
    password: '',
  };

  confirmPassword = '';
  dobInputType: 'text' | 'date' = 'text';

  constructor(private ownerService: OwnerService, private messageService: MessageService) {}

  onDobFocus() {
    this.dobInputType = 'date';
  }

  onDobBlur(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    if (!input.value) this.dobInputType = 'text';
  }

  register(form: NgForm) {
    if (!form.valid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Fill all required fields',
      });
      return;
    }

    if (this.owner.password !== this.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Passwords do not match',
      });
      return;
    }

    const payload: OwnerRequestDto = {
      ...this.owner,
      dateOfBirth: new Date(this.owner.dateOfBirth),
    };

    this.ownerService.registerOwner(payload).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'Owner registered successfully!',
        });
        form.resetForm();
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Registration failed',
        });
      },
    });
  }
}
