import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

/**
 * Logout dto
 */
export class LogoutDto {
  @ApiProperty({
    description: 'Session ID of the loginLog table',
    example: 1,
    required: false,
  })
  @IsOptional()
  session_id: string;
}