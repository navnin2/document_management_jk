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

  /**
   * API for lohin for users using localAuthDto
   * @param signInDto
   * @returns
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public() //set to public
  signIn(@Body() signInDto: LocalAuthDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  /**
   * Api for login user to log out
   * @param body
   * @returns
   */
  @ApiOperation({ summary: 'Logout and clear session' })
  @Post('logout')
  async logout(@Body() body: LogoutDto) {
    try {
      await this.authService.clearSession(body, null);
      return 'Logout';
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
