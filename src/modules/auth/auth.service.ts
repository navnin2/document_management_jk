import {
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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(LoginLog) private readonly loginModel: typeof LoginLog,
    private jwt: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({
      where: {
        email: username,
      },
      attributes: ['password', 'full_name', 'email', 'role_id', 'id'],
    });

    if (!(await compareHash(`${pass}`, user.password))) {
      console.log(8787);
      throw new UnauthorizedException();
    }
    const { password, ...result } = user.dataValues;
    try {
      const refreshToken = randomBytes(40).toString('hex');
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
      if (log > 0) {
        const [affectedCount, updatedLogin] = await this.loginModel.update(
          logBody,
          { where: { user_id: result.id }, returning: true },
        );

        loginLog = updatedLogin[0];
      } else {
        loginLog = await this.loginModel.create(logBody);
      }

      const token = await this.jwt.signAsync(
        { user_id: result.id, date: new Date(), role_id: result.role_id },
        {
          secret: process.env.JWT_SECRET,
        },
      );
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

  async clearSession(body) {
    console.log(body.session_id);
    const [updateCount, data] = await this.loginModel.update(
      { logout_at: moment().toDate(), active: false },
      { where: { uid: body.session_id }, returning: true },
    );

    if (updateCount > 0) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
