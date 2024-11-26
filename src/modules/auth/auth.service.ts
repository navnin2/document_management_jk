import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/entities/user.entity';
import { compareHash, uuid } from 'src/config/core.helper';
import { LoginLog } from './entity/loginlog.entity';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import * as moment from 'moment';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(LoginLog) private readonly loginModel: typeof LoginLog,
    private jwt: JwtService,
  ) {}

  /**
   * SignIn function for login to appliaction
   * @param username
   * @param pass
   * @returns
   */
  async signIn(username: string, pass: string): Promise<any> {
    // get user details using user name only specified attribute will return
    const user = await this.userModel.findOne({
      where: {
        email: username,
      },
      attributes: ['password', 'full_name', 'email', 'role_id', 'id', 'uid'],
    });

    // check the pass is same or not usong hash function if false throw error
    if (!(await compareHash(`${pass}`, user.password))) {
      throw new UnauthorizedException();
    }

    // seperate password from the user data
    const { password, ...result } = user.dataValues;
    try {
      const refreshToken = randomBytes(40).toString('hex'); //generate refresh token
      // check is the user had login any where
      const log = await this.loginModel.count({
        where: {
          user_id: result.id,
        },
      });
      let loginLog;
      const logBody = {
        token: refreshToken,
        token_expiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        user_id: result.id,
        login_at: new Date(),
        active: true,
      };
      //if the lohin data for specific user is there then  update with new token
      if (log > 0) {
        const [affectedCount, updatedLogin] = await this.loginModel.update(
          logBody,
          { where: { user_id: result.id }, returning: true },
        );

        loginLog = updatedLogin[0];
      } else {
        // create new login log for new login user
        loginLog = await this.loginModel.create(logBody);
      }

      // generate JWT token with the data and secret key that provided
      const token = await this.jwt.signAsync(
        { user_id: result.id, date: new Date(), role_id: result.role_id },
        {
          secret: process.env.JWT_SECRET,
        },
      );

      //set the expiry of the token as provider and requrement
      const tokenExpiry = moment().add(process.env.JWT_EXPIRE, 'seconds');

      return {
        error: false,
        data: {
          token,
          token_expiry: tokenExpiry,
          refresh_token: refreshToken,
          user: result,
          session_id: loginLog.uid,
        },
      };
    } catch (error) {
      return { error };
    }
  }

  /**
   * function to clear sessiona dn logout function
   * @param body
   * @returns
   */
  async clearSession(body, context: ExecutionContext) {
    //change the loginlog to flase and expire time to current time when cjeck in gurad it will get UnauthorizedException as the expired and token is not active
    const request = context.switchToHttp().getRequest(); //getting the request
    const token = this.extractTokenFromHeader(request); //  extracting the token from header
    const decode = await this.jwt.decode(token);

    const [updateCount, data] = await this.loginModel.update(
      { logout_at: moment().toDate(), active: false },
      {
        where: { uid: body.session_id, user_id: decode.user_id },
        returning: true,
      },
    );

    //if the updated data count is above 0 then logout done
    if (updateCount > 0) {
      return true;
    } else {
      // the session is not
      throw new UnauthorizedException();
    }
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
