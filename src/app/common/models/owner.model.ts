
import { Gender } from '../../enums/gender.enum';

export interface OwnerRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: Gender;
  password: string;
  businessName?: string;
  businessDescription?: string;
  businessRegistrationNumber?: string;
}
