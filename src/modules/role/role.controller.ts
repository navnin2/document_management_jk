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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationDto } from 'src/config/condition.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Public } from 'src/config/decorater/public.decorater';
import { Roles } from 'src/config/decorater/roles.decorator';
import { RolesEnum } from '../user/role.enum';

@Controller('role')
@ApiBearerAuth()
@ApiTags('Role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * craete new role and permission buy adim
   * @param createRoleDto
   * @returns
   */
  @Post()
  @Roles(RolesEnum.Admin) //admin privilage user can only craete role
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  /**
   * admin can see the list of roles added
   * @param query
   * @returns
   */
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.roleService.findAll(query);
  }

  /**
   * get the detail of the role based on uid
   * @param uid
   * @returns
   */
  @Get(':uid')
  @Roles(RolesEnum.Admin) //admin privilage user can only craete role
  findOne(@Param('uid') uid: string) {
    return this.roleService.findOne(uid);
  }

  /**
   * update the role and permission
   * @param uid
   * @param updateRoleDto
   * @returns
   */
  @Put(':uid')
  @Roles(RolesEnum.Admin) //admin privilage user can only craete role
  update(@Param('uid') uid: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(uid, updateRoleDto);
  }

  /**
   * delete the role buy admin
   * @param uid
   * @returns
   */
  @Delete(':uid')
  @Roles(RolesEnum.Admin) //admin privilage user can only craete role
  remove(@Param('uid') uid: string) {
    return this.roleService.remove(uid);
  }
}
