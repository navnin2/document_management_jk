import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import {
  BeforeSave,
  Column,
  DefaultScope,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { generateHash, uuid } from '../../../config/core.helper';
import { Role } from '../../role/entities/role.entity';

@DefaultScope(() => ({
  attributes: { exclude: ['password'] },
}))
@Table
export class User extends Model {
  @Column({ unique: true })
  @ApiProperty({
    description: 'unique string',
  })
  @IsString()
  uid: string;

  @Column
  @ApiProperty({
    description: 'First Name',
    example: 'Ross',
    readOnly: true,
  })
  first_name?: string;

  @Column
  @ApiProperty({
    description: 'Last Name',
    example: 'Geller',
    readOnly: true,
  })
  last_name?: string;

  @Column
  @ApiProperty({
    description: 'Full Name',
    example: 'Ross Geller',
  })
  @IsString()
  full_name: string;

  @Column
  @ApiProperty({
    description: 'Email',
    example: 'ross.geller@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @Column
  @ApiProperty({
    description: 'role of the user',
    example: 'Admin',
  })
  @ForeignKey(() => Role)
  role_id: number;

  @Column
  @ApiProperty({
    description: 'Password',
    example: '123456',
    writeOnly: true,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @BeforeSave
  static setUuid(instance: User) {
    instance.uid = uuid();
  }

  @BeforeSave
  static async hashPassword(instance: User) {
    if (instance.password) {
      instance.password = await generateHash(instance.password);
    }
  }

  @BeforeSave
  static setName(instance: User) {
    if (instance.full_name) {
      const name = instance.full_name.split(' ');
      instance.first_name = `${name[0]}`;
      instance.last_name = `${name.slice(1).join(' ')}`;
    }
  }
}
