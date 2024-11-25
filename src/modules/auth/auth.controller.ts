import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthDto } from './dto/localAuth.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LogoutDto } from './dto/logout.dto';
import { Public } from 'src/config/decorater/public.decorater';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() signInDto: LocalAuthDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @ApiOperation({ summary: 'Logout and clear session' })
  @Post('logout')
  async logout(@Body() body: LogoutDto) {
    try {
      await this.authService.clearSession(body);
      return 'Logout';
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
