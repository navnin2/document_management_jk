import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";
import { BeforeSave, Column, Model, Table } from "sequelize-typescript";
import { uuid } from "src/config/core.helper";
import { User } from "src/modules/user/entities/user.entity";

@Table
export class LoginLog extends Model {

    @Column({ unique: true })
    @ApiProperty({
        description: 'unique string',
    })
    @IsString()
    uid: string;

    @Column
    @ApiProperty({
        description: 'User ID',
        example: 1,
    })
    user_id: number;

    @Column
    @ApiProperty({
        description: 'Refresh Token',
        example: 'e9e93e0a5acfb6358c7c9fd91579b048d40574a',
    })
    token: string;

    @Column
    @ApiProperty({
        format: 'date-time',
        description: 'Token Expiry',
        example: '2021-01-01T00:00:00Z',
    })
    token_expiry: Date;

    @Column
    @ApiProperty({
        format: 'date-time',
        description: 'Last Login At',
        example: '2021-01-01T00:00:00Z',
        readOnly: true,
    })
    login_at?: Date;

    @Column
    @ApiProperty({
        format: 'date-time',
        description: 'Logout At',
        example: '2021-01-01T00:00:00Z',
    })
    logout_at: Date;


    @Column({ defaultValue: false })
    @ApiProperty({
        description: 'is active',
        example: false,
        required: false,
    })
    @IsBoolean()
    active: boolean;

    @BeforeSave
    static setUuid(instance: User) {
        instance.uid = uuid();
    }
}
