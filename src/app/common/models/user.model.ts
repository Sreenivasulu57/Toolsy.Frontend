import { Gender } from "../../enums/gender.enum";

export interface RegisterUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: Gender;
  password: string;
  profileImageUrl: string;
}
