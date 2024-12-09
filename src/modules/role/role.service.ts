import { HttpException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role) private readonly roleModel: typeof Role,
  ) { }

  /**
   * function to crarte the role
   * @param createRoleDto 
   * @returns 
   */
  async create(createRoleDto): Promise<Role> {
    try {
      return await this.roleModel.create(createRoleDto)
    } catch (err) {
      console.log(err)
      return err
    }

  }

  /**
   * function to get all role in DB
   * @param query 
   * @returns 
   */
  async findAll(query): Promise<object> {
    const data = await this.roleModel.findAndCountAll({
      limit: query.limit ? query.limit : null,
      offset: query.offset ? query.offset : 0,
      order: query.sort ? query.sort : [['createdAt', 'desc']]
    });

    return data
  }


  /**
   * function to get specific role based on Uid
   * @param uid 
   * @returns 
   */
  async findOne(uid: string): Promise<Role> {
    const data = await this.roleModel.findOne({
      where: {
        uid: uid
      }
    })
    return data
  }

  /**
   * update function to update role 
   * @param uid 
   * @param body 
   * @returns 
   */
  async update(uid, body): Promise<Role[]> {
    const [affectedCount, updatedRole] = await this.roleModel.update(body, { where: { uid }, returning: true });
    if (!affectedCount) {
      throw new HttpException('role not found', 404);
    }
    return updatedRole
  }

  /**
   * function tom delete the role
   * @param uid 
   * @returns 
   */
  async remove(uid: string): Promise<number> {
    const deletedRowsCount = await this.roleModel.destroy({ where: { uid }, });
    return deletedRowsCount;
  }
}
