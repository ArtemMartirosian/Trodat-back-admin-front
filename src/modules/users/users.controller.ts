import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAdminDto, LoginAdminDto } from './dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Role(UserRole.SUPERADMIN)
  @Post('create/admin')
  async createAdmin(@Body() data: CreateAdminDto) {
    return await this.usersService.createAdmin(data);
  }

  @Post('login/admin')
  async loginAdmin(@Body() data: LoginAdminDto) {
    return await this.usersService.loginAdmin(data);
  }
}
