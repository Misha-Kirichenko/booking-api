import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { DTO, DECORATORS, ENUMS, GUARDS, INTERFACES } from '@common';

const { RolesRestriction } = DECORATORS;
const { Role } = ENUMS;
const { RolesGuard } = GUARDS;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(RolesGuard)
  @RolesRestriction(Role.ADMIN)
  @Get("/")
  getAllUsers(@Query() usersQueryDTO: DTO.USER.UsersQueryDTO): Promise<INTERFACES.IPagingData<DTO.USER.UserDTO>> {
    return this.usersService.getAll(usersQueryDTO);
  }

  @UseGuards(RolesGuard)
  @RolesRestriction(Role.ADMIN)
  @Get("/:id")
  getUserById(@Param("id") id: string): Promise<DTO.USER.UserFullInfoDTO> {
    return this.usersService.getUserById(id);
  }
}
