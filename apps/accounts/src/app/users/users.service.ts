import { DTO } from '@common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'common/src/lib/entities';
import { Repository } from 'typeorm';
import { UTILS, INTERFACES } from '@common';
import { instanceToPlain, plainToInstance } from 'class-transformer';

const { RES_MESSAGE } = UTILS;

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

  public async getAll(usersQueryDTO: DTO.USER.UsersQueryDTO): Promise<INTERFACES.IPagingData<DTO.USER.UserDTO>> {
    const { page = 1, limit = 10, blocked } = usersQueryDTO;

    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where(`"user"."role" = 'user'`);

    if (blocked !== undefined) {
      if (blocked === true) queryBuilder.andWhere('user.blocked = true')
      else queryBuilder.andWhere('"user"."blocked" IS NULL OR "user"."blocked" = false');
    }

    const total = await queryBuilder.getCount();

    queryBuilder.skip((page - 1) * limit).take(limit);
    queryBuilder.addOrderBy('"user"."last_login"', 'DESC');
    queryBuilder.addOrderBy('"user"."name"', 'ASC');

    const data = await queryBuilder.getMany()
    const dtoData = plainToInstance(DTO.USER.UserDTO, data, { excludeExtraneousValues: true });
    return {
      data: instanceToPlain(dtoData) as DTO.USER.UserDTO[],
      total,
    };
  }

  public async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['bookings', 'bookings.room'],
    });

    if (!user) {
      throw new NotFoundException(RES_MESSAGE.ERROR.NOT_FOUND("User"));
    }

    return user;
  }
}
