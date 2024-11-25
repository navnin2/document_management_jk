import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
  ) { }

  async create(createUserDto): Promise<User> {
    const exists = await this.userModel.count({
      where: {
        email: createUserDto.email,
      },
    });
    if (exists) {
      throw new HttpException(
        `User already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await this.userModel.create(createUserDto);
    } catch (err) {
      console.log(err)
      return err
    }
  }

  async findAll(query): Promise<object> {
    const data = await this.userModel.findAndCountAll({
      limit: query.limit ? query.limit : -1,
      offset: query.offset ? query.offset : 0,
      order: query.sort ? query.sort : [['createdAt', 'desc']]
    });

    return data
  }


  async findOne(uid: string): Promise<User> {
    const data = await this.userModel.findOne({
      where: {
        uid: uid
      }
    })
    return data
  }

  async update(uid, body): Promise<User[]> {
    const [affectedCount, updatedRole] = await this.userModel.update(body, { where: { uid }, returning: true });
    if (!affectedCount) {
      throw new HttpException('Banner not found', 404);
    }
    return updatedRole
  }

  async remove(uid: string): Promise<number> {
    const deletedRowsCount = await this.userModel.destroy({ where: { uid }, });
    return deletedRowsCount;
  }
}
