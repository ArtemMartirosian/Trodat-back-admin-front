import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  Length,
  MaxLength,
} from 'class-validator';
import { UserRole } from '../enums';

export class CreateAdminDto {
  @IsEmail()
  email: string;

  @Length(6, 20)
  password: string;

  @IsOptional()
  @MaxLength(30)
  full_name: string;

  @IsOptional()
  @IsPhoneNumber()
  phone_number: string;

  role?: UserRole;
}
