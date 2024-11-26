import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { BeforeCreate, Column, Model, Table } from "sequelize-typescript";
import { uuid } from '../../../config/core.helper';

@Table
export class Ingestion extends Model {
    @Column({ unique: true })
    @ApiProperty({
        description: 'unique string',
    })
    @IsString()
    uid: string;

    @Column
    @ApiProperty({
        description: 'name of teh doc',
    })
    @IsString()
    name: string

    @Column
    @ApiProperty({
        description: 'url of teh documents',
    })
    @IsString()
    doc_url: string;

    @Column
    @ApiProperty({
        description: 'status of the ingestion',
    })
    @IsString()
    status: string;

    @BeforeCreate
    static setUuid(instance: Ingestion) {
        instance.uid = uuid();
    }
}
