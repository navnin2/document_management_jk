import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from 'src/modules/user/role.enum';

/**
 * Role based authcation Docorator
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);
