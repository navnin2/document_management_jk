import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/config/decorater/sql/roles.decorator';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '../role/entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(Role) private readonly roleModel: typeof Role,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const roleName = await this.roleModel.findByPk(user.role_id);
    const role: any = roleName.name;
    return requiredRoles.indexOf(role) > -1;
  }
}
