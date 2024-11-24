import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/sequelize';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CachingService } from 'src/config/caching/caching.service';
import { OWNER_INCLUDE_ATTRIBUTES_KEY } from 'src/config/decorater/sql/owner-attributes.decorator';
import { OWNER_INCLUDE_POPULATES_KEY } from 'src/config/decorater/sql/owner-populates.decorator';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private _config: ConfigService,
    private _cache: CachingService,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _config.get('jwt').secret,
      passReqToCallback: true,
    });
  }

  /**
   * calidate the user for authatication
   * @param req 
   * @param payload 
   * @returns 
   */
  async validate(req: any, payload: any) {
    const token = req.headers['authorization'];
    if (
      await this._cache.isBlackListed({ sessionId: payload.sessionId, token })
    ) {
      throw new UnauthorizedException();
    }
    const data = await this.userModel.findOne({
      where: {
        id: payload.userId,
      },
      attributes: { include: req[OWNER_INCLUDE_ATTRIBUTES_KEY] },
      include: req[OWNER_INCLUDE_POPULATES_KEY],
    });
    if (!data || !data.getDataValue('active')) {
      throw new UnauthorizedException();
    }
    return { ...data.toJSON(), ...payload };
  }
}
