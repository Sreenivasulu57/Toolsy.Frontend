import { Gender } from '../../enums/gender.enum';

export interface UserUpdateRequestDto {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: Gender;
  profileImageUrl: string;
}
