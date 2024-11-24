import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
    ApiExtraModels,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';
import { Public } from 'src/config/decorater/public.decorater';
import { Owner, OwnerDto } from 'src/config/decorater/sql/owner.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { LocalAuthDto } from './localAuth.dto';
import { LocalAuthGuard } from './localAuth.guard';
import { AuthService } from '../auth.service';

@ApiTags('auth')
@ApiExtraModels(User)
@Controller('auth/local')
export class LocalAuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * Login with username and password
     */
    @Post('')
    @Public()
    @ApiOperation({ summary: 'Local authentication' })
    @ApiOkResponse({
        description: 'Login success',
        schema: {
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        user: {
                            $ref: getSchemaPath(User),
                        },
                        token: {
                            type: 'string',
                        },
                        token_expiry: {
                            type: 'string',
                            format: 'date-time',
                        },
                        refresh_token: {
                            type: 'string',
                        },
                    },
                },
                message: {
                    type: 'string',
                    example: 'Created',
                },
            },
        },
    })
    @UseGuards(LocalAuthGuard)
    async localLogin(
        @Owner() owner: OwnerDto,
        @Body() auth: LocalAuthDto,
    ) {
        try {
            console.log(owner)
            const data = await this.authService.createSession(owner, {
                ...auth.info,
            });
            console.log(data)
            return data;
        } catch (err) {
            console.log(err)
            return err
        }
    }
}
