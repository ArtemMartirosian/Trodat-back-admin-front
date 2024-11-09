import {Length} from "class-validator";

export class LoginAdminDto {
  username: string;

  @Length(6, 20)
  password: string;
}
