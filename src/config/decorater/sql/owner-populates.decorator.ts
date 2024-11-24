import { SetMetadata } from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';

export const OWNER_INCLUDE_POPULATES_KEY = 'owner_include_populates';
export const OwnerIncludePopulate = (...populates: (keyof User)[]) =>
  SetMetadata(OWNER_INCLUDE_POPULATES_KEY, populates);
