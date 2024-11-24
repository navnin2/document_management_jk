import { PickType } from "@nestjs/mapped-types";
import { User } from "../entities/user.entity";

export class CreateUserDto extends PickType(User, ['full_name', 'email', 'password','role_id'] as const){}
