import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/modules/role/entities/role.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Role) private readonly roleModel: typeof Role,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  /**
   * store the predefined role to the db 
   */
  async seedRoles() {
    const roles = [
      { name: 'Admin', permission: ['manage user', 'view', 'edit'] },
      { name: 'Editer', permission: ['edit'] },
      { name: 'viewer', permission: ['view'] },
    ];

    for (const role of roles) {
      const [_, created] = await this.roleModel.findOrCreate({
        where: { name: role.name },
        defaults: role,
      });
    }
  }

  /**
   * add a user with role_id 1 to the db
   */
  async seedUser() {
    const users = [
      {
        full_name: 'Super Admin',
        password: '123456',
        role_id: 1,
        email: 'testAd@mailinator.com',
      },
    ];

    for (const user of users) {
      const [_, created] = await this.userModel.findOrCreate({
        where: { email: user.email },
        defaults: user,
      });
    }
  }
}
