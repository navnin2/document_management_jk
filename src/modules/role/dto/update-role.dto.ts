import { PartialType, PickType } from '@nestjs/swagger';
import { Role } from '../entities/role.entity';

export class UpdateRoleDto extends PartialType(PickType(Role, ['name', 'permission'] as const)) { }
