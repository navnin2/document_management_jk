import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as moment from 'moment-timezone';
import { Op } from 'sequelize';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { OwnerDto } from 'src/config/decorater/sql/owner.decorator';
import { InjectModel } from '@nestjs/sequelize';
import { LoginLog } from './entities/login-log.entity';
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { error } from 'console';
import { ConfigService } from '@nestjs/config';
import { CachingService } from 'src/config/caching/caching.service';

export interface AuthResponse {
    error?: any;
    user?: User;
}

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(LoginLog) private readonly loginModel: typeof LoginLog,
        private jwt: JwtService,
        private config: ConfigService,
        private _cache: CachingService,
    ) { }

    async createSession(owner: OwnerDto, info: any): Promise<any> {
        try {
            console.log(owner)
            const refreshToken = randomBytes(40).toString('hex');
            const log = await this.loginModel.create({
                token: refreshToken,
                token_expiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
                user_id: owner.id,
                info,
            });
            if (!log) return { error };
            const token = this.jwt.sign({ user_id: log.user_id, }, {
                secret: process.env.JWT_SECRET,
            });
            const tokenExpiry = moment().add(process.env.JWT_EXPIRE, 'seconds');

            return {
                error: false,
                data: {
                    token,
                    token_expiry: tokenExpiry,
                    refresh_token: refreshToken,
                    user: owner,
                    session_id: log.uid,
                },
            };
        } catch (error) {
            return { error };
        }
    }



    async clearSession(owner: OwnerDto, token: string) {
        const { exp, sessionId } = owner;
        console.log(exp, sessionId)
        await this.loginModel.update({ logout_at: moment().toDate(), active: false }, { where: { uid: sessionId }, returning: true });

        const authExp = new Date(exp * 1000);
        authExp.setHours(23, 59, 59, 999);
        const authRedisExpiry = authExp.getTime() - new Date().getTime();
        await this._cache.addToBlackList({
            expireAt: Math.floor(authRedisExpiry),
            token,
            sessionId,
        });
    }
}
