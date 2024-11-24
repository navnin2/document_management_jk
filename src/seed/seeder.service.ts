import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/modules/role/entities/role.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Role) private readonly roleModel: typeof Role,
  ) {}

  async seedRoles() {
    const roles = [
      { name: 'Admin', permission:['manage user', 'view','edit'] },
      { name: 'Editer', permission:['edit']},
      { name: 'viewer', permission:['view']},
    ];

    for (const role of roles) {
      const [_, created] = await this.roleModel.findOrCreate({
        where: { name: role.name },
        defaults: role,
      });

      if (created) {
        console.log(`Role "${role.name}" created`);
      } else {
        console.log(`Role "${role.name}" already exists`);
      }
    }
    console.log('Roles seeding completed.');
  }
}