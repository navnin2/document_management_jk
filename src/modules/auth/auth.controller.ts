import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Owner, OwnerDto } from 'src/config/decorater/sql/owner.decorator';
import { LogoutDto } from './logout.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and clear session' })
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Owner() owner: OwnerDto,
    @Body() body: LogoutDto,
  ) {

    try {
      if (!!body.session_id) {
        owner['sessionId'] = body.session_id;
      }
      console.log(owner)
      const token = req.headers?.authorization;
      await this.authService.clearSession(owner, token);
      return 'Logout'
    } catch (err) {
      console.log(err)
      return err
    }
  }
}