import { HttpException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role) private readonly roleModel: typeof Role,
  ) { }
  async create(createRoleDto): Promise<Role> {
    try {
      return await this.roleModel.create(createRoleDto)
    } catch (err) {
      console.log(err)
      return err
    }

  }

  async findAll(query): Promise<object> {
    const data = await this.roleModel.findAndCountAll({
      limit: query.limit ? query.limit : -1,
      offset: query.offset ? query.offset : 0,
      order: query.sort ? query.sort : [['createdAt', 'desc']]
    });

    return data
  }


  async findOne(uid: string): Promise<Role> {
    const data = await this.roleModel.findOne({
      where: {
        uid: uid
      }
    })
    return data
  }

  async update(uid, body): Promise<Role[]> {
    const [affectedCount, updatedRole] = await this.roleModel.update(body, { where: { uid }, returning: true });
    if (!affectedCount) {
      throw new HttpException('Banner not found', 404);
    }
    return updatedRole
  }

  async remove(uid: string): Promise<number> {
    const deletedRowsCount = await this.roleModel.destroy({ where: { uid }, });
    return deletedRowsCount;
  }
}
