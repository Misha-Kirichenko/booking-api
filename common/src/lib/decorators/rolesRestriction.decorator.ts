import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums';

export const RolesRestriction = (...roles: Role[]) =>
  SetMetadata('roles', roles);
