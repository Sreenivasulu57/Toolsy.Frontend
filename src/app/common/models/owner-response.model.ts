import { AccountStatus } from '../../enums/account-status.enum';
import { Gender } from '../../enums/gender.enum';
import { UserRole } from '../../enums/user-role.enum';
import { VerificationStatus } from '../../enums/verification-status.enum';
import { AddressRegisterDto } from './address.model';

export interface OwnerResponseDto {
  profileId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth: string;
  gender: Gender;
  profileImageUrl: string;
  isActive: boolean;
  status: AccountStatus;
  verificationStatus: VerificationStatus;
  emailVerifiedAt?: string | null;
  phoneVerifiedAt?: string | null;
  roles: UserRole[];
  address?: AddressRegisterDto | null;
  ownerId: string;
  businessName?: string;
  businessDescription?: string;
  businessRegistrationNumber?: string;
}
