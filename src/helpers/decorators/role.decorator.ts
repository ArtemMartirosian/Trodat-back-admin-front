import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../modules/users/enums/user-role.enum';

export const ROLES_KEY = 'role';

export const Role = (...role: UserRole[]) => SetMetadata(ROLES_KEY, role);
