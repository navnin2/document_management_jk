import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  /**
   * function to crate the new user
   * @param createUserDto 
   * @returns 
   */
  async create(createUserDto): Promise<User> {
    //geting the user with smae email
    const exists = await this.userModel.count({
      where: {
        email: createUserDto.email,
      },
    });
  
    if (exists) {
      throw new HttpException(`User already exists`, HttpStatus.BAD_REQUEST); //if smae email is there in db then throe error
    }
    try {
      return await this.userModel.create(createUserDto);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  /**
   * function find all user in db
   * @param query 
   * @returns 
   */
  async findAll(query): Promise<object> {
    const data = await this.userModel.findAndCountAll({
      limit: query.limit ? query.limit : null,
      offset: query.offset ? query.offset : 0,
      order: query.sort ? query.sort : [['createdAt', 'desc']],
    });

    return data;
  }

  /**
   * get the user details using the uid
   * @param uid 
   * @returns 
   */
  async findOne(uid: string): Promise<User> {
    const data = await this.userModel.findOne({
      where: {
        uid: uid,
      },
    });
    return data;
  }

  /**
   * update the user using uid
   * @param uid 
   * @param body 
   * @returns 
   */
  async update(uid, body): Promise<User[]> {
    const [affectedCount, updatedRole] = await this.userModel.update(body, {
      where: { uid },
      returning: true,
    });
    if (!affectedCount) {
      throw new HttpException('User not found', 404);
    }
    return updatedRole;
  }

  /**
   * remove the user from db
   * @param uid 
   * @returns 
   */
  async remove(uid: string): Promise<number> {
    const deletedRowsCount = await this.userModel.destroy({ where: { uid } });
    return deletedRowsCount;
  }
}
