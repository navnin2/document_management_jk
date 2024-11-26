import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

/**
 * findAll payload to do filter, search, sort, offset and all.
 */
export class PaginationDto {
  @ApiProperty({
    description: 'offset',
    example: 1,
  })
  @IsOptional()
  offset: number;

  @ApiProperty({
    description: 'limit',
    example: 10,
  })
  @IsOptional()
  limit: number;

  @ApiProperty({
    description: 'sort of the findAll',
    example: [['id', 'desc']],
  })
  @IsOptional()
  sort?: any;

  @ApiProperty({
    description: 'where condition of the findAll',
    example: {},
  })
  @IsOptional()
  where?: string;

  @ApiProperty({
    description: 'search condition of the findAll',
    example: {},
  })
  @IsOptional()
  search?: string;
}
