import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { User } from 'src/modules/user/entities/user.entity';
import { Strategy } from 'passport-local';
import { LocalAuthService } from './localAuth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: LocalAuthService) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(req: Request): Promise<User | never> {
    const { error, user } = await this.authService.validateUser(
      req.body.username,
      req.body.password,
    );
    if (!!error) {
      throw new UnauthorizedException(error);
    }
    return user;
  }
}
