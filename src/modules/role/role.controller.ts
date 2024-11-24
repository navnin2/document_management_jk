import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationDto } from 'src/config/condition.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../user/role.enum';
import { Roles } from 'src/config/decorater/sql/roles.decorator';

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
  @Roles(Role.Admin)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  /**
   * admin can see the list of roles added
   * @param query 
   * @returns 
   */
  @Get()
  @Roles(Role.Admin)
  findAll(@Query() query: PaginationDto) {
    return this.roleService.findAll(query);
  }

  /**
   * get the detail of the role based on uid
   * @param uid 
   * @returns 
   */
  @Get(':uid')
  @Roles(Role.Admin)
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
  @Roles(Role.Admin)
  update(@Param('uid') uid: string, @Body() updateRoleDto:UpdateRoleDto ) {
    return this.roleService.update(uid, updateRoleDto);
  }

/**
 * delete the role buy admin
 * @param uid 
 * @returns 
 */
  @Delete(':uid')
  @Roles(Role.Admin)
  remove(@Param('uid') uid: string) {
    return this.roleService.remove(uid);
  }

}
