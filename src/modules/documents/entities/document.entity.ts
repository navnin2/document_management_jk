import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { BeforeCreate, Column, Model, Table } from "sequelize-typescript";
import { uuid } from '../../../config/core.helper';

/**
 * table structe that store the doc file
 */
@Table
export class Document extends Model{
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

    @BeforeCreate
    static setUuid(instance: Document) {
      instance.uid = uuid();
    }
}
