import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '../role/entities/role.entity';
import { ROLES_KEY } from 'src/config/decorater/roles.decorator';
import { RolesEnum } from '../user/role.enum';

/**
 * function to check the role is currect as defined for specific api
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(Role) private readonly roleModel: typeof Role,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //chekc the role as per the role decorater
    const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    //check is the reqres role is that user have 
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    let data = await this.roleModel.findByPk(user.role_id);
    const role: any = data.name;
    return requiredRoles.indexOf(role) > -1;
  }
}
