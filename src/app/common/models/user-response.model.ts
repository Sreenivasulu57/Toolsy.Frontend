import { Gender } from '../../enums/gender.enum';

export interface UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email:string,
  phoneNumber: string;
  dateOfBirth: Date;
  gender: Gender;
  profileImageUrl:string,
}
