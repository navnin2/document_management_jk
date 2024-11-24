import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { compareHash } from 'src/config/core.helper';
import { User } from 'src/modules/user/entities/user.entity';

export interface AuthResponse {
    error?: any;
    user?: User;
}

@Injectable()
export class LocalAuthService {
    constructor(@InjectModel(User) private readonly UserModel: typeof User) { }

    async validateUser(
        username: string,
        password: string,
    ): Promise<AuthResponse> {
        const data = await this.UserModel.findOne({
            attributes: { include: ['password'] },
            where: { email: username },
        });
        if (!!data) {
            if (!(await compareHash(`${password}`, data.password))) {
                return { error: 'Invalid credentials' };
            }
            const user = data.toJSON();
            delete user.password;
            return { error: false, user };
        } else {
            return { error: 'Invalid credentials' };
        }
    }
}
