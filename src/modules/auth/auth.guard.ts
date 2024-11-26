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

  /**
   * Auth guard of the API 
   * @param context 
   * @returns 
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // chekcing the API is public or not
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // if the API is public then return the dunction as true no further checking
      return true;
    }

    const request = context.switchToHttp().getRequest(); //getting the request
    const token = this.extractTokenFromHeader(request); //  extracting the token from header
    const decode = await this.jwtService.decode(token); // decode the token using JWT service to get the data from token

    if (!token) {
      throw new UnauthorizedException(); //if no token is provided then return unauthorized
    }
    try {
      //getting the data from loginLog table
      const loginlog = await this.loginModel.findOne({
        where: {
          user_id: decode.user_id,
        },
      });

      //chekc the token is active or expired or already logout
      if (
        !loginlog.active ||
        loginlog.token_expiry.getTime() < new Date().getTime()
      ) {
        throw new UnauthorizedException(); // throw unauthorized if ocndition is true
      }
      const user = await this.userModel.findByPk(decode.user_id); // featcing the user details of token

      if (!user) {
        throw new UnauthorizedException(); // return UnauthorizedException if no user found
      }
      // verifying the token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      //We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    // reuting true if all the auth condition is true
    return true;
  }

  /**
   * function to extract the token from the heeader
   * @param request 
   * @returns 
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
