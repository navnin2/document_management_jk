import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/config/condition.dto';
import { Public } from 'src/config/decorater/public.decorater';
import { Roles } from 'src/config/decorater/roles.decorator';
import { RolesEnum } from './role.enum';

@ApiBearerAuth()
@ApiTags('user')
@ApiExtraModels(User)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Api to craete new user
   * @param createUserDto
   * @returns
   */
  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * get list of users based on the query
   * @param query
   * @returns
   */
  @Get()
  @Roles(RolesEnum.Admin) //only admin can get the list of users
  findAll(@Query() query: PaginationDto) {
    return this.userService.findAll(query);
  }

  /**
   * get one user details baesd on uid
   * @param uid
   * @returns
   */
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.userService.findOne(uid);
  }

  /**
   * update the user dealers using the uid
   * @param uid
   * @param updateUserDto
   * @returns
   */
  @Put(':uid')
  update(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(uid, updateUserDto);
  }

  /**
   * delete the userd details based on the uid
   * @param uid
   * @returns
   */
  @Delete(':uid')
  remove(@Param('uid') uid: string) {
    return this.userService.remove(uid);
  }
}
