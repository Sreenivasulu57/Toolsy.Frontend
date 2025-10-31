import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../common/services/user.service';
import { UserResponseDto } from '../../../common/models/user-response.model';
import { UserUpdateRequestDto } from '../../../common/models/user-update.model';
import { AddressRegisterDto } from '../../../common/models/address.model';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-update.html',
  styleUrls: ['./user-update.css'],
})
export class UserUpdate implements OnInit {
  userForm!: FormGroup;
  addressForm!: FormGroup;
  loading = false;
  profileId!: string;

  successMessageUser = '';
  errorMessageUser = '';
  successMessageAddress = '';
  errorMessageAddress = '';

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadUserProfile();
    this.loadAddress();
  }

  private initializeForms(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: [0, Validators.required],
      profileImageUrl: [''],
    });

    this.addressForm = this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      area: ['', Validators.required],
      mandal: ['', Validators.required],
      district: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
    });
  }
  private loadUserProfile(): void {
    this.loading = true;
    this.userService.getProfile().subscribe({
      next: (user: UserResponseDto | null) => {
        if (user) {
          this.profileId = user.id;
          const dob = user.dateOfBirth ? new Date(user.dateOfBirth) : null;
          const formattedDate = dob ? dob.toISOString().split('T')[0] : '';
          this.userForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            dateOfBirth: formattedDate,
            gender: user.gender,
            profileImageUrl: user.profileImageUrl,
          });
        } else {
          this.errorMessageUser = 'No user profile found.';
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessageUser = 'Failed to load profile details.';
      },
    });
  }

  private loadAddress(): void {
    this.userService.getAddress().subscribe({
      next: (address) => {
        if (address) this.addressForm.patchValue(address);
      },
      error: () => (this.errorMessageAddress = 'Failed to load address.'),
    });
  }

  onSubmitUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const updatedData: UserUpdateRequestDto = {
      ...this.userForm.value,
      dateOfBirth: new Date(this.userForm.value.dateOfBirth),
      gender: Number(this.userForm.value.gender),
    };

    this.userService.updateUser(updatedData).subscribe({
      next: () => {
        this.loading = false;
        this.successMessageUser = 'Profile updated successfully!';
        this.errorMessageUser = '';
      },
      error: () => {
        this.loading = false;
        this.errorMessageUser = 'Failed to update profile.';
        this.successMessageUser = '';
      },
    });
  }

  onSubmitAddress(action: 'add' | 'update'): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const addressData: AddressRegisterDto = this.addressForm.value;

    const request$ =
      action === 'add'
        ? this.userService.addAddress(this.profileId, addressData)
        : this.userService.updateAddress(this.profileId, addressData);

    request$.subscribe({
      next: () => {
        this.loading = false;
        if (action === 'add') {
          this.successMessageAddress = 'Address added successfully!';
        } else {
          this.successMessageAddress = 'Address updated successfully!';
        }
        this.errorMessageAddress = '';
      },
      error: () => {
        this.loading = false;
        if (action === 'add') {
          this.errorMessageAddress = 'Failed to add address.';
        } else {
          this.errorMessageAddress = 'Failed to update address.';
        }
        this.successMessageAddress = '';
      },
    });
  }
}
