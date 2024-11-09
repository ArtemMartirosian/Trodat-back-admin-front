import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config.service';
import { UserRole } from '../../users/enums';
import { User } from 'src/modules/users/schemas/user.schema';

@Injectable()
export class SuperAdminConfig {
  private readonly email: string;
  private readonly password: string;
  private role: string;

  constructor(configService: ConfigService) {
    this.email = configService.getString('SUPER_ADMIN_EMAIL');
    this.password = configService.getString('SUPER_ADMIN_PASS');
    this.role = UserRole.SUPERADMIN;
  }

  public createAdminOptions(): Partial<User> {
    console.log({
      email: this.email,
      password: this.password,
      role: UserRole.SUPERADMIN,
    });
    return {
      email: this.email,
      password: this.password,
      role: UserRole.SUPERADMIN,
    };
  }
}
