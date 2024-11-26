import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  BeforeCreate,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { uuid } from '../../../config/core.helper';

@Table
export class Role extends Model {
  @Column({ unique: true })
  @ApiProperty({
    description: 'unique string',
  })
  @IsString()
  uid: string;

  @Column
  @ApiProperty({
    description: 'Role name',
  })
  @IsString()
  name: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  permission: string[];

  @BeforeCreate
  static setUuid(instance: Role) {
    instance.uid = uuid();
  }
}
