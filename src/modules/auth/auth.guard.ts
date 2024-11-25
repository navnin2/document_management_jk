import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { LoginLog } from './entity/loginlog.entity';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/entities/user.entity';
import { IS_PUBLIC_KEY } from 'src/config/decorater/public.decorater';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(LoginLog) private readonly loginModel: typeof LoginLog,
    @InjectModel(User) private readonly userModel: typeof User,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const decode = await this.jwtService.decode(token);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const loginlog = await this.loginModel.findOne({
        where: {
          user_id: decode.user_id,
        },
      });

      if (
        !loginlog.active ||
        loginlog.token_expiry.getTime() < new Date().getTime()
      ) {
        throw new UnauthorizedException();
      }
      const user = await this.userModel.findByPk(decode.user_id);

      if (!user) {
        throw new UnauthorizedException();
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
